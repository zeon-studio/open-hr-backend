import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";

// create token
const createToken = (
  payload: Record<string, unknown>,
  secret: Secret,
  expires: string = "7d",
  timeStamp?: string
): string => {
  return jwt.sign(
    { id: payload.id, role: payload.role, at: timeStamp },
    secret as Secret,
    <SignOptions>{
      expiresIn: expires,
    }
  );
};

// verify token
const verifyToken = (token: string, secret: Secret): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};

export const jwtHelpers = {
  createToken,
  verifyToken,
};
