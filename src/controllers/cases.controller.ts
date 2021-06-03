import { Request, Response } from "express";
import * as psql from "../database";
import { ICase, State } from "../libs/interfaces";

class CasesController {
  public async add(req: Request, res: Response): Promise<void> {
    if (req.role === "helper") {
      const {
        name,
        last_name,
        dni,
        sex,
        birth_date,
        home_address,
        job_address,
        test_date,
        test_result,
        state,
      } = req.body;

      const case_: ICase = await psql.insertCase({
        name,
        last_name,
        dni,
        sex,
        birth_date,
        home_address,
        job_address,
        test_date,
        test_result,
      });
      await psql.insertCaseHistory({
        case_id: case_.id || "",
        state,
        update_date: test_date,
      });
      res.json({ ok: true });
    } else {
      res.json({ ok: false });
    }
  }

  public async getAllCases(req: Request, res: Response): Promise<void> {
    if (req.role === "helper" || req.role === "doctor") {
      try {
        const case_ = await psql.getAllCases();
        let cases: any[] = [];
        for (let i = 0; i < case_.length; i++) {
          const history = await psql.getCaseHistory(case_[i].id);

          cases.push({
            ...case_[i],
            state: history[0].state,
          });
        }
        res.json({ ok: true, cases });
      } catch (error) {
        res.json({ ok: false });
      }
    } else {
      res.json({ ok: false });
    }
  }

  public async getCaseById(req: Request, res: Response): Promise<void> {
    if (req.role === "helper" || req.role === "doctor") {
      const { case_id } = req.params;
      try {
        const case_ = await psql.getCaseById(case_id);
        let cases: any[] = [];
        for (let i = 0; i < case_.length; i++) {
          const history = await psql.getCaseHistory(case_[i].id);

          cases.push({
            ...case_[i],
            state: history[0].state,
            states: history,
          });
        }
        res.json({ ok: true, cases });
      } catch (error) {
        res.json({ ok: false });
      }
    } else {
      res.json({ ok: false });
    }
  }

  public async getCaseByDni(req: Request, res: Response): Promise<void> {
    if (req.role === "helper" || req.role === "doctor") {
      const { dni } = req.params;
      try {
        const case_ = await psql.getCaseByDni(parseInt(dni));
        let cases: any[] = [];
        for (let i = 0; i < case_.length; i++) {
          const history = await psql.getCaseHistory(case_[i].id);

          cases.push({
            ...case_[i],
            state: history[0].state,
            states: history,
          });
        }
        res.json({ ok: true, cases });
      } catch (error) {
        res.json({ ok: false });
      }
    } else {
      res.json({ ok: false });
    }
  }

  public async getCasesByName(req: Request, res: Response): Promise<void> {
    if (req.role === "helper") {
      const { name } = req.params;
      try {
        const case_ = await psql.getCaseByName(name);
        let cases: any[] = [];
        for (let i = 0; i < case_.length; i++) {
          const history = await psql.getCaseHistory(case_[i].id);

          cases.push({
            ...case_[i],
            state: history[0].state,
            states: history,
          });
        }
        res.json({ ok: true, cases });
      } catch (error) {
        res.json({ ok: false });
      }
    } else {
      res.json({ ok: false });
    }
  }

  public async updateState(req: Request, res: Response): Promise<void> {
    if (req.role === "helper") {
      const {
        state,
        name,
        last_name,
        dni,
        sex,
        birth_date,
        home_address,
        job_address,
        test_date,
        test_result,
      } = req.body;
      const { case_id } = req.params;
      await psql.updateCase(
        {
          name,
          last_name,
          dni,
          sex,
          birth_date,
          home_address,
          job_address,
          test_date,
          test_result,
        },
        case_id
      );
      const a = new Date();
      await psql.insertCaseHistory({
        state,
        update_date: new Date(
          `${a.getFullYear()}-${
            a.getMonth() + 1 > 9 ? a.getMonth() + 1 : `0${a.getMonth() + 1}`
          }-${a.getDate() + 1}`
        ).getTime(),
        case_id,
      });
      res.json({ ok: true });
    } else {
      res.json({ ok: false });
    }
  }

  public async getData(_req: Request, res: Response): Promise<void> {
    try {
      const case_ = await psql.getAllCases();
      let cases: any[] = [];
      let history: any[] = [];
      for (let i = 0; i < case_.length; i++) {
        history = await psql.getCaseHistory(case_[i].id);
        cases.push({
          ...case_[i],
          state: history[0].state,
        });
      }

      let infec = 0;
      let cured = 0;
      let deaths = 0;
      let home = 0;
      let hospital = 0;
      let icu = 0;
      let pos = 0;
      let neg = 0;

      for (let i = 0; i < cases.length; i++) {
        if (cases[i].test_result) {
          infec++;
          pos++;
        }

        if (cases[i].state === State.CURED) {
          cured++;
        }

        if (cases[i].state === State.DEAD) {
          deaths++;
        }

        if (cases[i].state === State.HOME_TREATMENT) {
          home++;
        }

        if (cases[i].state === State.ICU) {
          icu++;
        }

        if (cases[i].state === State.HOSPITAL_TREATMENT) {
          hospital++;
        }
        if (!cases[i].test_result) {
          neg++;
        }
      }

      const pie1 = [infec, cured, deaths];

      const pie2 = [home, hospital, icu, deaths];

      const pie3 = [pos, neg];

      const h1 = await psql.getCasesHistoryL1();
      const h2 = await psql.getCasesHistoryL2();
      const d = await psql.getCasesHistoryL3();

      const cs = new Array<number>(d.length).fill(0, 0, d.length);
      const ds = new Array<number>(d.length).fill(0, 0, d.length);
      const dd = [];

      for (let i = 0; i < d.length; i++) {
        if (h1) {
          for (let j = 0; j < h1.length; j++) {
            if (h1[j].date === d[i].date) {
              cs[i] = parseInt(h1[j].count);
            }
          }
        }
        if (h2) {
          for (let j = 0; j < h2.length; j++) {
            if (h2[j].date === d[i].date) {
              ds[i] = parseInt(h2[j].count);
            }
          }
        }

        const k = new Date(parseInt(d[i].date));

        dd.push(
          `${k.getFullYear()}-${
            k.getMonth() + 1 > 9 ? k.getMonth() + 1 : `0${k.getMonth() + 1}`
          }-${k.getDate() + 1}`
        );
      }

      const line = {
        dates: dd,
        cases: cs,
        deaths: ds,
      };

      res.json({
        ok: true,
        pie1,
        pie2,
        pie3,
        line,
      });
    } catch (error) {
      res.json({ ok: false });
    }
  }
}

export const casesController = new CasesController();
