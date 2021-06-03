import { Request, Response } from "express";
import { User, Role } from "../libs/interfaces";
import {
  comparePassword,
  cookieConf,
  createAcessToken,
  createRefreshToken,
  encryptPassword,
} from "../libs/auth";
import * as psql from "../database";

class AuthController {
  public async signUp(req: Request, res: Response): Promise<void | Response> {
    const { name, last_name, dni, user_name, password, role } = req.body;

    let role_: any = "";

    const _user2: User = await psql.getUserByUserName(user_name);

    if (_user2) {
      res.json({ ok: false });
    } else {
      if (role) {
        const foundRole: Role = await psql.getRole(role);
        if (foundRole) role_ = foundRole.id;
        else return res.json({ ok: false });
      } else {
        return res.json({ ok: false });
      }

      const pass = await encryptPassword(password);

      const _ = await psql.insertUser({
        name,
        last_name,
        dni,
        user_name,
        password: pass,
        role_name: role_,
        token_version: 0,
      });

      res.json({
        ok: true,
      });
    }
  }

  public async signIn(req: Request, res: Response): Promise<void> {
    const { user_name, password } = req.body;
    const _user: User = await psql.getUserByUserName(user_name);

    if (_user.user_name === user_name) {
      const matchPass = await comparePassword(password, _user.password);
      if (!matchPass) {
        res.json({ ok: false });
      } else {
        res.cookie("jid", createRefreshToken(_user), cookieConf);

        res.json({
          ok: true,
          user: {
            user: _user.user_name,
            name: _user.name,
            id: _user.id,
            role: _user.role_name,
          },
          accessToken: createAcessToken(_user),
        });
      }
    } else res.json({ ok: false });
  }

  public logOut(_req: Request, res: Response) {
    res.cookie("jid", "", cookieConf);
    res.json({ ok: true });
  }
}

export const authController = new AuthController();
