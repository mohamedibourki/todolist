import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOrderColumnToTodos1753906347656 implements MigrationInterface {
  name = 'AddOrderColumnToTodos1753906347656';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "todos" ADD "order" integer NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "todos" DROP COLUMN "order"`);
  }
}
