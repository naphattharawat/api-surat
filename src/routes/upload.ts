import { NextFunction, Response, Request } from 'express';
var express = require('express');
var router = express.Router();



const { v4: uuidv4 } = require('uuid');
import * as path from 'path';
import * as fs from 'fs';
import * as fse from 'fs-extra';
import * as rimraf from 'rimraf';
import multer from 'multer';
import moment from 'moment';

import { UploadModel } from '../model/upload';
const uploadModel = new UploadModel();

const uploadDir = process.env.UPLOAD_DIR || './upload';

fse.ensureDirSync(uploadDir);

var storage = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    if (req.query.path) {
      const _path = path.join(uploadDir, req.query.path)
      fse.ensureDirSync(_path);
      cb(null, _path)
    } else {
      const _path = uploadDir;
      cb(null, _path)
    }
  },
  filename: function (req: any, file: any, cb: any) {
    let _ext = path.extname(file.originalname);
    cb(null, Date.now() + _ext)
  }
})

let upload = multer({ storage: storage })


router.post('/', upload.any(), async (req: any, res: any) => {
  let db = req.db;
  let files = req.files;
  // console.log(req);

  let docs: any = [];

  try {
    files.forEach((v: any) => {
      // let fileData = fs.readFileSync(v.path);
      let document_id = uuidv4();
      let obj = {
        document_id: document_id,
        file_name: v.filename,
        file_path: v.path,
        file_size: v.size,
        mime_type: v.mimetype
      };
      docs.push(obj);
    });
    if (docs.length) {
      await uploadModel.saveUpload(db, docs)
      res.send({ ok: true, files: docs });
    } else {
      res.send({ ok: false, error: 'No file upload!' });
    }
  } catch (error) {
    console.log(error);
    res.send({ ok: false, error: error });
  }
});



router.get('/info/:documentCode', upload.any(), async (req: any, res: any) => {
  let documentId = req.params.documentId;
  let db = req.db;

  try {
    const rs = await uploadModel.getFiles(db, documentId)
    console.log(rs);
    if (rs.length) {
      let files: any = [];
      for (const v of rs) {
        files.push({
          document_id: v.document_id,
          file_name: v.file_name,
          upload_datetime: v.upload_datetime
        });
      }
      res.send({ ok: true, rows: files });
    } else {
      res.send({ ok: false, error: 'ไม่พบรูป' });
    }
  } catch (error) {
    res.send({ ok: false, error: error });
  }
});

router.delete('/:documentId', upload.any(), (req: any, res: any) => {
  let documentId = req.params.documentId;
  let db = req.db;

  uploadModel.getFileInfo(db, documentId)
    .then((rows) => {
      if (rows.length) {
        uploadModel.removeFile(db, documentId)
          .then(() => {
            let filePath = rows[0].file_path;
            rimraf.sync(filePath);
            res.send({ ok: true });
          })
          .catch(error => {
            res.send({ ok: false, error: error });
          })
          .finally(() => {
            db.destroy();
          })
      } else {
        res.send({ ok: false, error: 'ไม่พบไฟล์ที่ต้องการลบ' })
      }
    })
    .catch((error) => {
      res.send({ ok: false, error: error });
    });
});

router.get('/:documentId', upload.any(), async (req: any, res: any) => {
  let documentId = req.params.documentId;
  let db = req.db;

  try {
    const rows = await uploadModel.getFiles(db, documentId)
    if (rows.length) {
      let file = rows[0].file_path;
      let filename = path.basename(file);
      let mimetype = rows[0].mime_type;

      res.setHeader('Content-disposition', 'attachment; filename=' + filename);
      res.setHeader('Content-type', mimetype);

      let filestream = fs.createReadStream(file);
      filestream.pipe(res);
    } else {
      res.send({ ok: false, error: 'File not found!' })
    }
  } catch (error) {
    res.send({ ok: false, error: error });
  }
});
module.exports = router;
