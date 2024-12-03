import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddStatus1733169579196 implements MigrationInterface {
  name = 'AddStatus1733169579196'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`UPDATE "time_sheets" SET "active" = true WHERE "active" IS NULL`)
    await queryRunner.query(`ALTER TABLE "time_sheets" RENAME COLUMN "active" TO "status"`)
    await queryRunner.query(`ALTER TABLE "time_sheets" DROP COLUMN "status"`)
    await queryRunner.query(`CREATE TYPE "public"."time_sheets_status_enum" AS ENUM('OPEN', 'CLOSED')`)
    await queryRunner.query(
      `ALTER TABLE "time_sheets" ADD "status" "public"."time_sheets_status_enum" NOT NULL DEFAULT 'OPEN'`,
    )
    await queryRunner.query(`UPDATE "time_sheets" SET "status" = 'OPEN' WHERE "status" IS NULL`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "time_sheets" DROP COLUMN "status"`)
    await queryRunner.query(`DROP TYPE "public"."time_sheets_status_enum"`)
    await queryRunner.query(`ALTER TABLE "time_sheets" ADD "status" boolean NOT NULL DEFAULT true`)
    await queryRunner.query(`ALTER TABLE "time_sheets" RENAME COLUMN "status" TO "active"`)
  }
}
