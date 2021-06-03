import { Request, Response } from "express";
import { verify } from "jsonwebtoken";
import config from "../config";
import { cookieConf, createAcessToken, createRefreshToken } from "../libs/auth";
import { Payload, User } from "../libs/interfaces";
import * as psql from "../database";

class IndexController {
  public index(_req: Request, res: Response): void {
    res.json({
      message: "Hello",
    });
  }
  public async refreshToken(req: Request, res: Response): Promise<void> {
    const token = req.cookies.jid;
    if (!token) {
      res.json({
        ok: false,
        accessToken: "",
      });
    } else {
      try {
        const payload = verify(token, config.JWT.REFRESH) as Payload;
        const user: User = await psql.getUserByUserName(payload.user);
        if (!user) {
          res.json({
            ok: false,
            accessToken: "",
          });
        } else {
          if (user.token_version !== payload.token_version) {
            res.json({
              ok: false,
              accessToken: "",
            });
          } else {
            res.cookie("jid", createRefreshToken(user), cookieConf);
            res.json({
              ok: true,
              accessToken: createAcessToken(user),
            });
          }
        }
      } catch (error) {
        res.json({
          ok: false,
          accessToken: "",
        });
      }
    }
  }
  public async revokeRefreshTokens(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const user_: User = await psql.getUserById(id);
    if (user_.user_name) {
      await psql.updateToken(id);
      res.json({ ok: true });
    } else {
      res.json({ ok: false });
    }
  }
}

export const indexController = new IndexController();
