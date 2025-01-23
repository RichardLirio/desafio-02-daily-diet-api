import { Knex } from "knex";

declare module "knex/types/tables" {
  export interface Tables {
    users: {
      id: string;
      email: string;
      password: string;
      salt: string;
      created_at: string;
    };
  }
}
