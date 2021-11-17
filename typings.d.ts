// import { Multer } from 'multet';
import * as express from 'express';
// declare var multer: Multer;

// export = multer;
declare module 'express' {

  interface Request {
    db: any // Actually should be something like `multer.Body`
    // knex: Knex,
    decoded: any // Actually should be something like `multer.Files`
    file: any
    files: any[];
    multer: any
  }
}