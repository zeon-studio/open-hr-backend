"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), ".env") });
exports.default = {
    env: process.env.NODE_ENV,
    database_uri: process.env.MONGO_URI,
    port: process.env.PORT,
    salt: Number(process.env.SALT_ROUND),
    jwt_secret: process.env.JWT_SECRET,
    jwt_expire: process.env.JWT_TOKEN_EXPIRE,
    dos_public_access_key: process.env.DOS_PUBLIC_ACCESS_KEY,
    dos_public_secret_key: process.env.DOS_PUBLIC_SECRET_KEY,
    dos_bucket_name: process.env.DOS_BUCKET_NAME,
    dos_region: process.env.DOS_REGION,
    sender_email: process.env.SENDER_EMAIL,
    sender_password: process.env.EMAIL_PASSWORD,
    discord_webhook_url: process.env.DISCORD_WEBHOOK_URL,
    id_prefix: process.env.ID_GENERATOR_PREFIX,
    cors_origin: String(process.env.CORS_ORIGIN),
};
//# sourceMappingURL=variables.js.map