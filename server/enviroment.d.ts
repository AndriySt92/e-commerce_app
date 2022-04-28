import { IUserSchema } from "./models/User";

declare module "express" { 
  export interface Request {
    user: IUserSchema
  }
}

declare module 'express-serve-static-core' {
  export interface Request {
    user: IUserSchema
  }
}

declare global {
    namespace NodeJS {
      interface ProcessEnv {
        SECRET_KEY: string;
        PORT: string;
        MONGO_URL: string;
        NODE_ENV: 'development' | 'production';
      }
    }
  }
  
  // If this file has no import/export statements (i.e. is a script)
  // convert it into a module by adding an empty export statement.
  export {}