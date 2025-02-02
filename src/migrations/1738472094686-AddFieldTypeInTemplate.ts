import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddFieldTypeInTemplate1738472094686 implements MigrationInterface {
  name = 'AddFieldTypeInTemplate1738472094686'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "templates" ADD "type" character varying(100)`)
    await queryRunner.query(`UPDATE "templates" SET "type" = 'CUSTOMER' WHERE "type" IS NULL`)
    await queryRunner.query(`ALTER TABLE "templates" ALTER COLUMN "type" SET NOT NULL`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "templates" DROP COLUMN "type"`)
  }
}
