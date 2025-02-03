import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddFieldPayWorkerInProduct1738546559287 implements MigrationInterface {
  name = 'AddFieldPayWorkerInProduct1738546559287'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "products" ADD "pay_worker" numeric`)
    await queryRunner.query(`UPDATE "products" SET "pay_worker" = 0`)
    await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "pay_worker" SET NOT NULL`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "pay_worker"`)
  }
}
