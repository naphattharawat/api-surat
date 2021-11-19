import { Knex } from 'knex';
export class TitleModel {

    getList(db: Knex) {
        return db('titles')
        .where('is_deleted','N')
    }
    getInfo(db: Knex, id: any) {
        return db('titles')
            .where('id', id);
    }
    save(db: Knex, data: any) {
        return db('titles')
            .insert(data);
    }
    update(db: Knex, id: any, data: any) {
        return db('titles')
            .where('id', id)
            .update(data);
    }
    delete(db: Knex, id: any) {
        return db('titles')
            .where('id', id)
            .update('is_deleted','Y');
    }
}

