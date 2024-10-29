import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddUnitField1730163253641 implements MigrationInterface {
  name = 'AddUnitField1730163253641'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "extra_rules" ADD "unit" character varying(20)`)
    await queryRunner.query(`UPDATE "extra_rules" SET "unit" = 'skus'`)
    await queryRunner.query(`ALTER TABLE "extra_rules" ALTER COLUMN "unit" SET NOT NULL`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `COMMENT ON COLUMN "extra_rules"."unit" IS 'Unidad de medida para el cargo: sku, pallet, etc.'`,
    )
    await queryRunner.query(`ALTER TABLE "extra_rules" DROP COLUMN "unit"`)
  }
}
