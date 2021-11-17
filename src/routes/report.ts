import { NextFunction, Request, Response } from "express";
var express = require('express');
var router = express.Router();

import * as ejs from 'ejs';
import * as fs from 'fs';
import * as path from 'path';
import * as fse from 'fs-extra';
import * as pdf from 'html-pdf';
import * as rimraf from 'rimraf';
import moment from 'moment';

const exportPath = path.join(__dirname, './temp');
fse.ensureDirSync(exportPath);

import { UsersModel } from '../model/users';
const usersModel = new UsersModel();
/* GET users listing. */
router.get('/users/pdf', async function (req: Request, res: Response, next: NextFunction) {
    try {
        const fileName = `${moment().format('x')}.pdf`;
        const pdfPath = path.join(exportPath, fileName);
        const _ejsPath = path.join(__dirname, '../../views/report_user.ejs');
        var contents = fs.readFileSync(_ejsPath, 'utf8');
        //get Data
        const rs: any = await usersModel.getList(req.db);

        // create objects
        let data: any = {};
        data.currentDate = `${moment().locale('th').format('D MMMM')} พ.ศ.​ ${moment().get('year') + 543}`;
        data.list = rs;

        // create HTML file
        let html = ejs.render(contents, data);
        // Pdf size
        let options: any = { format: 'A4' };

        // Create pdf file
        pdf.create(html, options).toFile(pdfPath, function (err: any, data: any) {
            if (err) {
                console.log(err);
                res.send({ ok: false, error: err });
            } else {
                fs.readFile(pdfPath, function (err, data) {
                    if (err) {
                        res.send({ ok: false, error: err });
                    } else {

                        rimraf.sync(pdfPath);

                        res.contentType("application/pdf");
                        res.send(data);
                    }
                });
            }
        });
    } catch (error: any) {
        res.send({ ok: false, error: error.message })
    }
});

module.exports = router;
