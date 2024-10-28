import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddFileUnit1730141319698 implements MigrationInterface {
  name = 'AddFileUnit1730141319698'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "extra_rules" ADD "unit" character varying(50)`)
    await queryRunner.query(`UPDATE "extra_rules" SET "unit" = 'per_item'`)
    await queryRunner.query(`ALTER TABLE "extra_rules" ALTER COLUMN "unit" SET NOT NULL`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "extra_rules" DROP COLUMN "unit"`)
  }
}
