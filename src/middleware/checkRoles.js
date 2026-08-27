import createHttpError from "http-errors";

export const checkRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw createHttpError(401, "Unauthorized");
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw createHttpError(403, "Forbidden");
    }

    next();
  };
};
