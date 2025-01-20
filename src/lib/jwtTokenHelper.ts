import jwt, { JwtPayload, Secret } from "jsonwebtoken";

// create token
const createToken = (
  payload: Record<string, unknown>,
  secret: Secret,
  expires?: string,
  timeStamp?: string
): string => {
  return jwt.sign(
    { id: payload?.id, role: payload?.role, at: timeStamp },
    secret as Secret,
    {
      expiresIn: expires ? expires : "9999d",
    }
  );
};

// delete token
const deleteToken = (token: string, secret: Secret): string => {
  return jwt.sign({ id: token }, secret as Secret, {
    expiresIn: "0s",
  });
};

// verify token
const verifyToken = (token: string, secret: Secret): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};

export const jwtHelpers = {
  createToken,
  deleteToken,
  verifyToken,
};
