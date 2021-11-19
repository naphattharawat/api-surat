import { NextFunction, Request, Response } from "express";
var express = require('express');
var router = express.Router();
import { LoginModel } from '../model/login';
const loginModel = new LoginModel();
var CryptoJS = require("crypto-js");

import { JwtModel } from '../model/jwt';
const jwtModel = new JwtModel();

router.post('/', async function (req: Request, res: Response) {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const users: any = await loginModel.findUsername(req.db, username);
        if (users.length) {
            const hash = CryptoJS.MD5(password).toString();
            if (users[0].password == hash) {
                const payload = {
                    id: users[0].id,
                    userType: users[0].type,
                    hospcode: users[0].hospcode,
                    first_name: users[0].first_name,
                    last_name: users[0].last_name
                }
                const token = await jwtModel.sign(payload);
                res.send({ ok: true, token: token, info: payload });
            } else {
                res.send({ ok: false, error: 'รหัสผ่านไม่ถูกต้อง' });
            }
        } else {
            res.send({ ok: false, error: 'ไม่พบ username' });
        }
    } catch (error: any) {
        res.send({ ok: false, error: error.message });
    }
})

module.exports = router;
