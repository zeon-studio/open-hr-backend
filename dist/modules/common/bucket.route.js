"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchFile = exports.deleteFile = void 0;
const variables_1 = __importDefault(require("../../config/variables"));
const roles_1 = require("../../enums/roles");
const sendResponse_1 = require("../../lib/sendResponse");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const bucketRouter = express_1.default.Router();
// s3 config
const s3Config = {
    region: variables_1.default.dos_region,
    endpoint: `https://${variables_1.default.dos_region}.digitaloceanspaces.com`,
    credentials: {
        accessKeyId: variables_1.default.dos_public_access_key,
        secretAccessKey: variables_1.default.dos_public_secret_key,
    },
};
const s3 = new client_s3_1.S3Client(s3Config);
// public upload file to s3
const uploadFile = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3: s3,
        bucket: variables_1.default.dos_bucket_name,
        acl: function (req, file, cb) {
            const permission = req.body.permission;
            if (permission === "public-read" || permission === "private") {
                cb(null, permission);
            }
            else {
                cb(new Error("Invalid ACL type specified"));
            }
        },
        key: function (req, file, cb) {
            const folder = req.body.folder;
            if (!folder) {
                return cb(new Error("Folder name is required"));
            }
            cb(null, folder + "/" + Date.now().toString() + "-" + file.originalname);
        },
    }),
});
// upload router
bucketRouter.post("/upload", (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR, roles_1.ENUM_ROLE.USER), (req, res, next) => {
    const uploadSingle = uploadFile.single("file");
    uploadSingle(req, res, (err) => {
        if (err) {
            return next(err);
        }
        return (0, sendResponse_1.sendResponse)(res, {
            statusCode: 200,
            success: true,
            message: "File uploaded successfully",
            result: req.file,
        });
    });
});
// delete file from s3
const deleteFile = (key) => __awaiter(void 0, void 0, void 0, function* () {
    const deleteParams = {
        Bucket: variables_1.default.dos_bucket_name,
        Key: key,
    };
    try {
        return yield s3.send(new client_s3_1.DeleteObjectCommand(deleteParams));
    }
    catch (err) {
        throw new Error(`Failed to delete file: ${err.message}`);
    }
});
exports.deleteFile = deleteFile;
// check if file exists in s3
const checkFileExists = (key) => __awaiter(void 0, void 0, void 0, function* () {
    const headParams = {
        Bucket: variables_1.default.dos_bucket_name,
        Key: key,
    };
    try {
        yield s3.send(new client_s3_1.HeadObjectCommand(headParams));
        return true;
    }
    catch (err) {
        if (err.name === "NotFound") {
            return false;
        }
        throw new Error(`Failed to check file existence: ${err.message}`);
    }
});
// Helper function for retry deletion
const retryDelete = (key_1, ...args_1) => __awaiter(void 0, [key_1, ...args_1], void 0, function* (key, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            yield (0, exports.deleteFile)(key);
            yield new Promise((resolve) => setTimeout(resolve, 1000));
            const stillExists = yield checkFileExists(key);
            if (!stillExists) {
                return true;
            }
        }
        catch (error) {
            console.error(`Delete attempt ${i + 1} failed:`, error);
        }
    }
    return false;
});
// delete router
bucketRouter.delete("/delete/:key", (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR, roles_1.ENUM_ROLE.USER), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const key = decodeURIComponent(req.params.key);
    if (!key) {
        return (0, sendResponse_1.sendResponse)(res, {
            statusCode: 400,
            success: false,
            message: "Key is required",
        });
    }
    try {
        // Check if file exists before deleting
        const fileExists = yield checkFileExists(key);
        if (!fileExists) {
            return (0, sendResponse_1.sendResponse)(res, {
                statusCode: 404,
                success: false,
                message: "File not found",
            });
        }
        // Delete the file
        yield (0, exports.deleteFile)(key);
        // Verify deletion with retry logic
        const deleted = yield retryDelete(key);
        if (!deleted) {
            return (0, sendResponse_1.sendResponse)(res, {
                statusCode: 500,
                success: false,
                message: "Failed to delete file after multiple attempts",
            });
        }
        return (0, sendResponse_1.sendResponse)(res, {
            statusCode: 200,
            success: true,
            message: "File deleted successfully",
        });
    }
    catch (error) {
        console.error("Delete file error:", error);
        next(error);
    }
}));
// fetch file from s3
const fetchFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const key = decodeURIComponent(req.params.key);
        if (!key) {
            return (0, sendResponse_1.sendResponse)(res, {
                statusCode: 400,
                success: false,
                message: "Key is required",
            });
        }
        const command = new client_s3_1.GetObjectCommand({
            Bucket: variables_1.default.dos_bucket_name,
            Key: key,
        });
        const data = yield s3.send(command);
        if (data.Body) {
            const bodyStream = data.Body;
            res.setHeader("Content-Type", data.ContentType || "application/octet-stream");
            res.setHeader("Content-Length", ((_a = data.ContentLength) === null || _a === void 0 ? void 0 : _a.toString()) || "0");
            bodyStream.pipe(res);
        }
        else {
            return (0, sendResponse_1.sendResponse)(res, {
                statusCode: 404,
                success: false,
                message: "File not found",
            });
        }
    }
    catch (error) {
        console.error(error);
        return (0, sendResponse_1.sendResponse)(res, {
            statusCode: 500,
            success: false,
            message: "Error fetching file",
        });
    }
});
exports.fetchFile = fetchFile;
// fetch router
bucketRouter.get("/fetch/:key", (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR, roles_1.ENUM_ROLE.USER), exports.fetchFile);
// generate download url
const downloadFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const key = decodeURIComponent(req.params.key);
        if (!key) {
            return (0, sendResponse_1.sendResponse)(res, {
                statusCode: 400,
                success: false,
                message: "Key is required",
            });
        }
        const command = new client_s3_1.GetObjectCommand({
            Bucket: variables_1.default.dos_bucket_name,
            Key: key,
        });
        const url = yield (0, s3_request_presigner_1.getSignedUrl)(s3, command, { expiresIn: 60 * 30 });
        res.json({ url });
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Error generating presigned URL");
    }
});
// download router
bucketRouter.get("/download/:key", (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR, roles_1.ENUM_ROLE.USER), downloadFile);
exports.default = bucketRouter;
//# sourceMappingURL=bucket.route.js.map