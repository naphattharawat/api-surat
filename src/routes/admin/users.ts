import { NextFunction, Request, Response } from "express";
import moment from 'moment';
import { UsersModel } from "../../model/admin/users";
const usersModel = new UsersModel();
var CryptoJS = require("crypto-js");
var express = require('express');
var router = express.Router();


/* GET users listing. */
router.get('/', async function (req: Request, res: Response, next: NextFunction) {
    try {
        const query: any = req.query.query;
        const rs: any = await usersModel.getList(req.db, query);
        res.send({ ok: true, rows: rs })
    } catch (error) {
        res.send({ ok: false, error: error })
    }
});

router.get('/page', async function (req: Request, res: Response, next: NextFunction) {
    try {
        const limit: any = req.query.limit || 0;
        const offset: any = req.query.offset || 0;
        const rs: any = await usersModel.getListLimit(req.db, limit, offset);
        res.send({ ok: true, rows: rs })
    } catch (error) {
        res.send({ ok: false, error: error })
    }
});

router.get('/info', async function (req: Request, res: Response, next: NextFunction) {
    try {
        const id: any = req.query.id;
        const rs: any = await usersModel.info(req.db, +id);
        res.send({ ok: true, rows: rs[0] })
    } catch (error) {
        res.send({ ok: false, error: error })
    }
});

router.post('/', async function (req: Request, res: Response, next: NextFunction) {
    try {
        const body = req.body;
        if (body.first_name && body.last_name && body.password) {
            const users: any = await usersModel.findUsername(req.db, body.username);
            if (users.length === 0) {
                const obj: any = {
                    first_name: body.first_name,
                    last_name: body.last_name,
                    title_id: body.title_id,
                    username: body.username,
                    hospcode: body.hospcode,
                    type: body.type,
                    password: CryptoJS.MD5(body.password).toString()
                }
                const rs: any = await usersModel.saveUser(req.db, obj);
                res.send({ ok: true, rows: rs })
            } else {
                res.send({ ok: false, error: 'Username ?????????' });
            }
        } else {
            res.send({ ok: false, error: '??????????????? parameter' })
        }
    } catch (error: any) {
        console.log(error);
        res.send({ ok: false, error: error.message })
    }
});

router.delete('/:id', async function (req: Request, res: Response, next: NextFunction) {
    try {
        const id: any = req.params.id;
        const rs: any = await usersModel.delete(req.db, +id);
        res.send({ ok: true, rows: rs })
    } catch (error) {
        res.send({ ok: false, error: error })
    }
});

router.put('/:id', async function (req: Request, res: Response, next: NextFunction) {
    try {
        const id: any = req.params.id;
        const body: any = req.body;
        const obj: any = {
            first_name: body.first_name,
            last_name: body.last_name,
            title_id: body.title_id,
            username: body.username,
            type: body.type,
            hospcode: body.hospcode
        }
        if (body.password) {
            obj.password = CryptoJS.MD5(body.password).toString()
        }
        const rs: any = await usersModel.update(req.db, +id, obj);
        res.send({ ok: true, rows: rs })
    } catch (error) {
        res.send({ ok: false, error: error })
    }
});



module.exports = router;
