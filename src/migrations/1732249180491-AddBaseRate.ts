import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddBaseRate1732249180491 implements MigrationInterface {
  name = 'AddBaseRate1732249180491'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "time_sheets" ADD "base" numeric DEFAULT 0`)
    await queryRunner.query(`UPDATE "time_sheets" SET "base" = 0 WHERE "base" IS NULL`)
    await queryRunner.query(`ALTER TABLE "time_sheets" ALTER COLUMN "base" SET NOT NULL`)
    await queryRunner.query(`COMMENT ON COLUMN "time_sheets"."base" IS 'Base rate of the timesheet'`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`COMMENT ON COLUMN "time_sheets"."base" IS 'Base rate of the timesheet'`)
    await queryRunner.query(`ALTER TABLE "time_sheets" DROP COLUMN "base"`)
  }
}
