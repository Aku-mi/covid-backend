import config from "../config";
import { User } from "./interfaces";
import { sign } from "jsonwebtoken";
import { CookieOptions } from "express";
import bcrypt from "bcryptjs";

export const encryptPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const comparePassword = async (
  password: string,
  receivedPassword: string
): Promise<boolean> => await bcrypt.compare(password, receivedPassword);

export const createAcessToken = (user: User): string => {
  return sign(
    {
      user: user.user_name,
      _id: user.id,
      role: user.role_name,
      token_version: user.token_version,
    },
    config.JWT.ACCESS,
    {
      expiresIn: "30m",
    }
  );
};

export const createRefreshToken = (user: User): string => {
  return sign(
    {
      user: user.user_name,
      _id: user.id,
      role: user.role_name,
      token_version: user.token_version,
    },
    config.JWT.REFRESH,
    {
      expiresIn: "1d",
    }
  );
};

export const cookieConf: CookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  path: "/api/refresh_token",
};
