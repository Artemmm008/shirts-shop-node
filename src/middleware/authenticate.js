import createHttpError from "http-errors";
import { Session } from "../models/session.js";
import { User } from '../models/user.js';

export const authenticate = async (req, res, next) => {
  const { accessToken, sessionId } = req.cookies;

  if (!accessToken || !sessionId) {
    throw createHttpError(401, "Unauthorized")
  };

  const session = await Session.findOne({
    _id: sessionId,
    accessToken,
  });

  if (!session) {
    throw createHttpError(401, "Session not found");
  }

  const isAccessTokenExpired = session.accessTokenValidUntil < new Date();

  if (isAccessTokenExpired) {
    throw createHttpError(401, "Access token expired");
  };

  const user = await User.findById(session.userId)

  if (!user) {
    throw createHttpError(401, "User not found");
  };

  req.user = user;

  next();
};

export const optionalAuthenticate = async (req, res, next) => {
  const { accessToken, sessionId } = req.cookies;

  if (!accessToken || !sessionId) {
    return next()
  };

  const session = await Session.findOne({
    _id: sessionId,
    accessToken,
  });

  if (session && session.accessTokenValidUntil > new Date()) {
    const user = await User.findById(session.userId);
    if (user) {
      req.user = user;
    };
  };

  next();
};
