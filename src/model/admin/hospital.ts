import { Knex } from 'knex';
export class HospitalModel {

    getList(db: Knex) {
        return db('hospitals')
        .where('is_deleted','N')
    }
    getInfo(db: Knex, id: any) {
        return db('hospitals')
            .where('id', id);
    }
    save(db: Knex, data: any) {
        return db('hospitals')
            .insert(data);
    }
    update(db: Knex, id: any, data: any) {
        return db('hospitals')
            .where('id', id)
            .update(data);
    }
    delete(db: Knex, id: any) {
        return db('hospitals')
            .where('id', id)
            .update('is_deleted','Y');
    }
}

