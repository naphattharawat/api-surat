import { Knex } from 'knex'
export class UsersModel {

    getList(db: Knex, query = '') {
        const _query = `%${query}%`
        return db('users as u')
            .select('u.id', 'u.first_name', 'u.username',
                'u.last_name', 'u.title_id', 't.name as title_name','u.hospcode','u.type')
            .leftJoin('titles as t', 't.id', 'u.title_id')
            .where('u.is_deleted','N')
            .where((w) => {
                w.where('u.first_name', 'like', _query)
                w.where('u.last_name', 'like', _query)
                w.where('u.username', 'like', _query)
            })
    }

    getListLimit(db: Knex, limit: any, offset: any) {
        return db('users as u')
            .select('u.id', 'u.first_name', 'u.username',
                'u.last_name', 'u.title_id', 't.name as title_name','u.hospcode','u.type')
            .join('titles as t', 't.id', 'u.title_id')
            .where('u.is_deleted','N')
            .limit(limit)
            .offset(offset)
    }

    total(db: Knex) {
        return db('users')
            .count('* as count')
            .where('u.is_deleted','N');
    }

    saveUser(db: Knex, data: any) {
        return db('users')
            .insert(data);
    }

    info(db: Knex, id: number) {
        return db('users')
            .select('id', 'first_name', 'username', 'last_name', 'title_id', 'type','hospcode')
            .where('id', id)
    }

    findUsername(db: Knex, username: string) {
        return db('users')
            .where('username', username)
            .where('u.is_deleted','N')
    }

    delete(db: Knex, id: number) {
        return db('users')
            .where('id', id)
            .update('is_deleted','Y')
    }

    update(db: Knex, id: number, data: any) {
        return db('users')
            .where('id', id)
            .update(data);
    }
}