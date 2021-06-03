export interface User {
  id?: string;
  name: string;
  last_name: string;
  dni: number;
  user_name: string;
  password: string;
  token_version: number;
  role_name: string;
}

export interface ICase {
  id?: string;
  name: string;
  last_name: string;
  dni: number;
  sex: "M" | "F";
  birth_date: number;
  home_address: string;
  job_address: string;
  test_result: boolean;
  test_date: number;
}

export enum State {
  HOME_TREATMENT = "Tratamiento en casa",
  HOSPITAL_TREATMENT = "Tratamiento en hospital",
  ICU = "UCI",
  CURED = "Curado",
  DEAD = "Muerto",
}

export interface CaseHistory {
  state: State;
  update_date: number;
  case_id: string;
}

export interface Payload {
  user: string;
  _id: string;
  role: string;
  token_version: number;
  iat: number;
  exp: number;
}

export interface Role {
  name: string;
  id?: number;
}
