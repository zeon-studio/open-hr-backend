import jwt, { JwtPayload, Secret } from "jsonwebtoken";

const createToken = (
  payload: Record<string, unknown>,
  secret: Secret,
  expires: string
): string => {
  return jwt.sign({ id: payload?.id, role: payload.role }, secret as Secret, {
    expiresIn: expires,
  });
};

const verifyToken = (token: string, secret: Secret): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};

export const jwtHelpers = {
  createToken,
  verifyToken,
};
