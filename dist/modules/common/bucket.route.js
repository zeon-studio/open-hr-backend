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
const checkToken_1 = require("../../middlewares/checkToken");
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
            cb(null, folder + "/" + file.originalname + "-" + Date.now().toString());
        },
    }),
});
// upload router
bucketRouter.post("/upload", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR, roles_1.ENUM_ROLE.USER), (req, res, next) => {
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
// delete router
bucketRouter.delete("/delete/:key", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR, roles_1.ENUM_ROLE.USER), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        const headResult = yield checkFileExists(key);
        if (!headResult) {
            return (0, sendResponse_1.sendResponse)(res, {
                statusCode: 404,
                success: false,
                message: "File not found",
            });
        }
        const deleteResult = yield (0, exports.deleteFile)(key);
        if (!deleteResult) {
            return (0, sendResponse_1.sendResponse)(res, {
                statusCode: 500,
                success: false,
                message: "Failed to delete file",
            });
        }
        // Verify deletion after deletion
        const existsAfterDelete = yield checkFileExists(key);
        if (existsAfterDelete) {
            // Retry logic
            let retryCount = 0;
            const maxRetries = 3;
            let deleted = false;
            while (retryCount < maxRetries && !deleted) {
                yield new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second
                yield (0, exports.deleteFile)(key);
                const stillExists = yield checkFileExists(key);
                if (!stillExists) {
                    deleted = true;
                }
                retryCount++;
            }
            if (!deleted) {
                return (0, sendResponse_1.sendResponse)(res, {
                    statusCode: 500,
                    success: false,
                    message: "Failed to delete file after multiple attempts",
                });
            }
        }
        return (0, sendResponse_1.sendResponse)(res, {
            statusCode: 200,
            success: true,
            message: "File deleted successfully",
        });
    }
    catch (error) {
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
bucketRouter.get("/fetch/:key", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR, roles_1.ENUM_ROLE.USER), exports.fetchFile);
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
bucketRouter.get("/download/:key", checkToken_1.checkToken, (0, auth_1.default)(roles_1.ENUM_ROLE.ADMIN, roles_1.ENUM_ROLE.MODERATOR, roles_1.ENUM_ROLE.USER), downloadFile);
exports.default = bucketRouter;
//# sourceMappingURL=bucket.route.js.map