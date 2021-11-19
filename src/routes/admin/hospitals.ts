import { NextFunction, Response, Request } from 'express';
var express = require('express');
var router = express.Router();

import { HospitalModel } from '../../model/admin/hospital';

const hospitalModel = new HospitalModel();


router.get('/', async function (req: Request, res: Response, next: NextFunction) {
  try {
    const rs: any = await hospitalModel.getList(req.db);
    res.send({ ok: true, rows: rs })
  } catch (error: any) {
    res.send({ ok: false, error: error.message })
  }
});

router.get('/info', async function (req: Request, res: Response, next: NextFunction) {
  try {
    const id: any = req.query.id;
    const rs: any = await hospitalModel.getInfo(req.db, id);
    res.send({ ok: true, rows: rs[0] })
  } catch (error: any) {
    res.send({ ok: false, error: error.message })
  }
});

router.post('/', async function (req: Request, res: Response, next: NextFunction) {
  try {
    const data: any = req.body;
    const rs: any = await hospitalModel.save(req.db, data);
    res.send({ ok: true, rows: rs })
  } catch (error: any) {
    res.send({ ok: false, error: error.message })
  }
});
router.put('/', async function (req: Request, res: Response, next: NextFunction) {
  try {
    const id: any = req.query.id;
    const data: any = req.body;
    const rs: any = await hospitalModel.update(req.db, id, data);
    res.send({ ok: true, rows: rs })
  } catch (error: any) {
    res.send({ ok: false, error: error.message })
  }
});
router.delete('/', async function (req: Request, res: Response, next: NextFunction) {
  try {
    const id: any = req.query.id;
    const rs: any = await hospitalModel.delete(req.db, id);
    res.send({ ok: true, rows: rs })
  } catch (error: any) {
    res.send({ ok: false, error: error.message })
  }
});


module.exports = router;

