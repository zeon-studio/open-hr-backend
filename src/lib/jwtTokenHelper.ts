import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";

// create token
const createToken = (
  payload: Record<string, unknown>,
  secret: Secret,
  expires?: string,
  timeStamp?: string
): string => {
  const enhancedPayload = {
    id: payload?.id,
    role: payload?.role,
    at: timeStamp || Date.now().toString(),
    iat: Math.floor(Date.now() / 1000),
  };

  return jwt.sign(enhancedPayload, secret as Secret, <SignOptions>{
    expiresIn: expires ? expires : "24h",
    issuer: "open-hr-backend",
  });
};

// delete token
const deleteToken = (token: string, secret: Secret): string => {
  return jwt.sign({ id: token }, secret as Secret, {
    expiresIn: "0s",
  });
};

// verify token
const verifyToken = (token: string, secret: Secret): JwtPayload => {
  try {
    const decoded = jwt.verify(token, secret, {
      issuer: "open-hr-backend",
    }) as JwtPayload;

    // Additional validation
    if (!decoded.id || !decoded.role) {
      throw new Error("Invalid token structure");
    }

    // Check if token is not too old (additional security layer)
    if (decoded.iat) {
      const tokenAge = Date.now() - decoded.iat * 1000;
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours
      if (tokenAge > maxAge) {
        throw new Error("Token too old");
      }
    }

    return decoded;
  } catch (error) {
    throw new Error("Token verification failed");
  }
};

export const jwtHelpers = {
  createToken,
  deleteToken,
  verifyToken,
};
