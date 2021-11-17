import { Knex } from 'knex'
export class UsersModel {

    getList(db: Knex) {
        return db('users as u')
            .select('u.id', 'u.first_name',
                'u.last_name', 'u.title_id', 't.name as title_name')
            .join('titles as t', 't.id', 'u.title_id')
    }

    getListLimit(db: Knex, limit: any, offset: any) {
        return db('users as u')
            .select('u.id', 'u.first_name',
                'u.last_name', 'u.title_id', 't.name as title_name')
            .join('titles as t', 't.id', 'u.title_id')
            .limit(limit)
            .offset(offset)
    }

    total(db: Knex) {
        return db('users')
            .count('* as count');
    }

    saveUser(db: Knex, data: any) {
        return db('users')
            .insert(data);
    }

    info(db: Knex, id: number) {
        return db('users')
            .where('id', id)
    }

    findUsername(db: Knex, username: string) {
        return db('users')
            .where('username', username)
    }

    delete(db: Knex, id: number) {
        return db('users')
            .where('id', id)
            .delete()
    }

    update(db: Knex, id: number, data: any) {
        return db('users')
            .where('id', id)
            .update(data);
    }
}