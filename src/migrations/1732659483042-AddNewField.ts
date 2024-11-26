import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddNewField1732659483042 implements MigrationInterface {
  name = 'AddNewField1732659483042'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "rules_worker" ADD "payment_type" character varying(100)`)
    await queryRunner.query(`UPDATE "rules_worker" SET "payment_type" = 'default_value' WHERE "payment_type" IS NULL`)
    await queryRunner.query(`ALTER TABLE "rules_worker" ALTER COLUMN "payment_type" SET NOT NULL`)
    await queryRunner.query(`ALTER TABLE "timesheet_workers" ADD "pay" double precision`)
    await queryRunner.query(`UPDATE "timesheet_workers" SET "pay" = 0 WHERE "pay" IS NULL`)
    await queryRunner.query(`ALTER TABLE "timesheet_workers" ALTER COLUMN "pay" SET NOT NULL`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "timesheet_workers" DROP COLUMN "pay"`)
    await queryRunner.query(`ALTER TABLE "rules_worker" DROP COLUMN "payment_type"`)
  }
}
