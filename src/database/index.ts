import { Pool } from "pg";
import config from "../config";
import { User, ICase, CaseHistory } from "../libs/interfaces";

const poolOptions = {
  user: config.DB.USER,
  host: config.DB.HOST,
  database: config.DB.DATABASE,
  password: config.DB.PASSWORD,
  port: config.DB.PORT,
};

export const insertUser = async (user: User) => {
  const pool = new Pool(poolOptions);

  await pool.query(
    "INSERT INTO users(id,name,last_name,dni,user_name,password,role,token_version) VALUES(uuid_generate_v4(), $1, $2, $3, $4, $5, $6, $7)",
    [
      user.name,
      user.last_name,
      user.dni,
      user.user_name,
      user.password,
      user.role_name,
      user.token_version,
    ]
  );

  const res = await pool.query("SELECT * FROM users WHERE user_name = $1", [
    user.user_name,
  ]);
  pool.end();
  return res.rows[0];
};

export const getUserById = async (id: string) => {
  const pool = new Pool(poolOptions);
  const res = await pool.query(
    "SELECT users.name AS name,users.last_name AS last_name,users.dni AS dni,users.user_name AS user_name,users.password AS password, users.id AS id,roles.name AS role_name,token_version FROM users JOIN roles ON users.role = roles.id WHERE users.id = $1",
    [id]
  );
  pool.end();
  return res.rows[0];
};

export const getUserByUserName = async (user_name: string) => {
  const pool = new Pool(poolOptions);
  const res = await pool.query(
    "SELECT users.name AS name,users.last_name AS last_name,users.dni AS dni,users.user_name AS user_name,users.password AS password, users.id AS id,roles.name AS role_name,token_version FROM users JOIN roles ON users.role = roles.id WHERE user_name = $1",
    [user_name]
  );
  pool.end();
  return res.rows[0];
};

export const updateToken = async (id: string) => {
  const pool = new Pool(poolOptions);
  const res = await pool.query(
    "UPDATE users SET token_version = token_version + 1 WHERE id = $1",
    [id]
  );
  pool.end();
  return res.rows;
};

export const getRole = async (name: string) => {
  const pool = new Pool(poolOptions);
  const res = await pool.query("SELECT * FROM roles WHERE name = $1", [name]);
  pool.end();
  return res.rows[0];
};

export const insertCase = async (case_: ICase) => {
  const pool = new Pool(poolOptions);
  await pool.query(
    "INSERT INTO cases(id,name,last_name,dni,sex,birth_date,home_address,job_address,test_result,test_date) VALUES(uuid_generate_v4(), $1, $2, $3, $4, $5, $6, $7, $8, $9)",
    [
      case_.name,
      case_.last_name,
      case_.dni,
      case_.sex,
      case_.birth_date,
      case_.home_address,
      case_.job_address,
      case_.test_result,
      case_.test_date,
    ]
  );

  const res = await getCaseByDni(case_.dni);
  pool.end();
  return res[0];
};

export const updateCase = async (case_: ICase, id: string) => {
  const pool = new Pool(poolOptions);
  await pool.query(
    "UPDATE cases SET name = $1,last_name = $2,dni = $3,sex=$4,birth_date=$5,home_address=$6,job_address=$7,test_result=$8,test_date=$9 WHERE id = $10",
    [
      case_.name,
      case_.last_name,
      case_.dni,
      case_.sex,
      case_.birth_date,
      case_.home_address,
      case_.job_address,
      case_.test_result,
      case_.test_date,
      id,
    ]
  );

  const res = await getCaseByDni(case_.dni);
  pool.end();
  return res[0];
};

export const getAllCases = async () => {
  const pool = new Pool(poolOptions);
  const res = await pool.query("SELECT * FROM cases");
  pool.end();
  return res.rows;
};

export const getCaseById = async (id: string) => {
  const pool = new Pool(poolOptions);
  const res = await pool.query("SELECT * FROM cases WHERE id = $1", [id]);
  pool.end();
  return res.rows;
};

export const getCaseByDni = async (dni: number) => {
  const pool = new Pool(poolOptions);
  const res = await pool.query("SELECT * FROM cases WHERE dni = $1", [dni]);
  pool.end();
  return res.rows;
};

export const getCaseByName = async (name: string) => {
  const pool = new Pool(poolOptions);
  const res = await pool.query("SELECT * FROM cases WHERE name = $1", [name]);
  pool.end();
  return res.rows;
};

export const insertCaseHistory = async (caseH: CaseHistory) => {
  const pool = new Pool(poolOptions);
  const res = await pool.query(
    "INSERT INTO case_history(id,state,update_date,case_id) VALUES(uuid_generate_v4(), $1, $2, $3)",
    [caseH.state, caseH.update_date, caseH.case_id]
  );
  pool.end();
  return res.rows[0];
};

export const getCaseHistory = async (case_id: string) => {
  const pool = new Pool(poolOptions);
  const res = await pool.query(
    "SELECT state,id AS s_id,update_date FROM case_history WHERE case_id = $1 ORDER BY update_date DESC",
    [case_id]
  );
  pool.end();
  return res.rows;
};

export const getCasesHistoryL1 = async () => {
  const pool = new Pool(poolOptions);
  const res = await pool.query(
    "SELECT update_date AS date, count(*) FROM case_history WHERE state != 'Curado' GROUP BY date ORDER BY update_date ASC"
  );
  pool.end();
  return res.rows;
};

export const getCasesHistoryL2 = async () => {
  const pool = new Pool(poolOptions);
  const res = await pool.query(
    "SELECT update_date as date,count(*) FROM case_history WHERE state = 'Muerto' GROUP BY date ORDER BY update_date ASC"
  );
  pool.end();
  return res.rows;
};

export const getCasesHistoryL3 = async () => {
  const pool = new Pool(poolOptions);
  const res = await pool.query(
    "SELECT update_date as date FROM case_history GROUP BY date ORDER BY update_date ASC"
  );
  pool.end();
  return res.rows;
};
