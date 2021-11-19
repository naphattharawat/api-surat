import { NextFunction, Response, Request } from 'express';
var express = require('express');
var router = express.Router();

import { TitleModel } from '../../model/admin/titles';

const titleModel = new TitleModel();


router.get('/', async function (req: Request, res: Response, next: NextFunction) {
  try {
    const rs: any = await titleModel.getList(req.db);
    res.send({ ok: true, rows: rs })
  } catch (error) {
    res.send({ ok: false, error: error })
  }
});

router.get('/info', async function (req: Request, res: Response, next: NextFunction) {
  try {
    const id: any = req.query.code;
    const rs: any = await titleModel.getInfo(req.db, id);
    res.send({ ok: true, rows: rs })
  } catch (error) {
    res.send({ ok: false, error: error })
  }
});

router.post('/', async function (req: Request, res: Response, next: NextFunction) {
  try {
    const data: any = req.body;
    const rs: any = await titleModel.save(req.db, data);
    res.send({ ok: true, rows: rs })
  } catch (error) {
    res.send({ ok: false, error: error })
  }
});
router.put('/', async function (req: Request, res: Response, next: NextFunction) {
  try {
    const id: any = req.query.id;
    const data: any = req.body;
    const rs: any = await titleModel.update(req.db, id, data);
    res.send({ ok: true, rows: rs })
  } catch (error) {
    res.send({ ok: false, error: error })
  }
});
router.delete('/', async function (req: Request, res: Response, next: NextFunction) {
  try {
    const id: any = req.query.id;
    const rs: any = await titleModel.delete(req.db, id);
    res.send({ ok: true, rows: rs })
  } catch (error) {
    res.send({ ok: false, error: error })
  }
});


module.exports = router;

