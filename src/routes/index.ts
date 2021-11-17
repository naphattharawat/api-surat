import { NextFunction, Response, Request } from 'express';
var express = require('express');
var router = express.Router();

import { TestModel } from '../model/test';

const testModel = new TestModel();


router.get('/', async function (req: Request, res: Response, next: NextFunction) {
  res.send({ ok: true});
  // res.render('report', { title: 'Express' });
});

router.get('/test', async function (req: Request, res: Response, next: NextFunction) {
  const rs: any = await testModel.test(req.db);
  res.send({ ok: true, rows: rs })
});


module.exports = router;

