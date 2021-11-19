import { Knex } from 'knex';

export class UploadModel {
  saveUpload(db: Knex, data: any) {
    return db('documents')
      .insert(data);
  }

  getFiles(db: Knex, documentId: string) {
    return db('documents')
      .select('document_id', 'file_name', 'file_path', 'mime_type')
      .where('document_id', documentId);
  }

  getFileInfo(db: Knex, documentId: string) {
    return db('documents')
      .select('file_path', 'mime_type')
      .where('document_id', documentId);
  }

  removeFile(db: Knex, documentId: string) {
    return db('documents')
      .where('document_id', documentId)
      .del();
  }
}
