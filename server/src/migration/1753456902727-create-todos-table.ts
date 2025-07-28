import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTodosTable1753456902727 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE todos (
        id BIGSERIAL PRIMARY KEY,
        name TEXT,
        completed BOOLEAN NOT NULL DEFAULT FALSE
      ); 
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE todos;`);
  }
}
