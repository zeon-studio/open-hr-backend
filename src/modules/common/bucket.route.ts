import config from "@/config/variables";
import { ENUM_ROLE } from "@/enums/roles";
import { sendResponse } from "@/lib/sendResponse";
import auth from "@/middlewares/auth";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  S3Client,
  S3ClientConfig,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import express, { Response } from "express";
import multer from "multer";
import multerS3 from "multer-s3";
import { Readable } from "stream";

const bucketRouter = express.Router();

// s3 config
const s3Config: S3ClientConfig = {
  region: config.dos_region as string,
  endpoint: `https://${config.dos_region}.digitaloceanspaces.com`,
  credentials: {
    accessKeyId: config.dos_public_access_key as string,
    secretAccessKey: config.dos_public_secret_key as string,
  },
};
const s3 = new S3Client(s3Config);

// public upload file to s3
const uploadFile = multer({
  storage: multerS3({
    s3: s3,
    bucket: config.dos_bucket_name as string,
    acl: function (req, file, cb) {
      const permission = req.body.permission;
      if (permission === "public-read" || permission === "private") {
        cb(null, permission);
      } else {
        cb(new Error("Invalid ACL type specified"));
      }
    },
    key: function (req, file, cb) {
      const folder = req.body.folder;
      if (!folder) {
        return cb(new Error("Folder name is required"));
      }
      cb(
        null,
        "open-hr/" +
          folder +
          "/" +
          Date.now().toString() +
          "-" +
          file.originalname,
      );
    },
  }),
});

// upload router
bucketRouter.post(
  "/upload",
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER),
  (req, res, next) => {
    const uploadSingle = uploadFile.single("file");

    uploadSingle(req, res, (err: any) => {
      if (err) {
        return next(err);
      }
      return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "File uploaded successfully",
        result: req.file,
      });
    });
  },
);

// delete file from s3
export const deleteFile = async (key: string) => {
  const deleteParams = {
    Bucket: config.dos_bucket_name,
    Key: key,
  };

  try {
    return await s3.send(new DeleteObjectCommand(deleteParams));
  } catch (err: any) {
    throw new Error(`Failed to delete file: ${err.message}`);
  }
};

// check if file exists in s3
const checkFileExists = async (key: string) => {
  const headParams = {
    Bucket: config.dos_bucket_name,
    Key: key,
  };

  try {
    await s3.send(new HeadObjectCommand(headParams));
    return true;
  } catch (err: any) {
    if (err.name === "NotFound") {
      return false;
    }
    throw new Error(`Failed to check file existence: ${err.message}`);
  }
};

// Helper function for retry deletion
const retryDelete = async (
  key: string,
  maxRetries: number = 3,
): Promise<boolean> => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await deleteFile(key);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const stillExists = await checkFileExists(key);
      if (!stillExists) {
        return true;
      }
    } catch (error) {
      console.error(`Delete attempt ${i + 1} failed:`, error);
    }
  }
  return false;
};

// delete router
bucketRouter.delete(
  "/delete/:key",
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER),
  async (req, res, next) => {
    const key = decodeURIComponent(req.params.key);

    if (!key) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Key is required",
      });
    }

    try {
      // Check if file exists before deleting
      const fileExists = await checkFileExists(key);
      if (!fileExists) {
        return sendResponse(res, {
          statusCode: 404,
          success: false,
          message: "File not found",
        });
      }

      // Delete the file
      await deleteFile(key);

      // Verify deletion with retry logic
      const deleted = await retryDelete(key);
      if (!deleted) {
        return sendResponse(res, {
          statusCode: 500,
          success: false,
          message: "Failed to delete file after multiple attempts",
        });
      }

      return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "File deleted successfully",
      });
    } catch (error) {
      console.error("Delete file error:", error);
      next(error);
    }
  },
);

// fetch file from s3
export const fetchFile = async (req: any, res: Response) => {
  try {
    const key = decodeURIComponent(req.params.key);

    if (!key) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Key is required",
      });
    }

    const command = new GetObjectCommand({
      Bucket: config.dos_bucket_name,
      Key: key,
    });

    const data = await s3.send(command);

    if (data.Body) {
      const bodyStream = data.Body as Readable;
      res.setHeader(
        "Content-Type",
        data.ContentType || "application/octet-stream",
      );
      res.setHeader("Content-Length", data.ContentLength?.toString() || "0");
      bodyStream.pipe(res);
    } else {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "File not found",
      });
    }
  } catch (error) {
    console.error(error);

    return sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Error fetching file",
    });
  }
};

// fetch router
bucketRouter.get(
  "/fetch/:key",
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER),
  fetchFile,
);

// generate download url
const downloadFile = async (req: any, res: Response) => {
  try {
    const key = decodeURIComponent(req.params.key);

    if (!key) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Key is required",
      });
    }

    const command = new GetObjectCommand({
      Bucket: config.dos_bucket_name,
      Key: key,
    });
    const url = await getSignedUrl(s3, command, { expiresIn: 60 * 30 });

    res.json({ url });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating presigned URL");
  }
};

// download router
bucketRouter.get(
  "/download/:key",
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER),
  downloadFile,
);

export default bucketRouter;
