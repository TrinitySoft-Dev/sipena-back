import { MigrationInterface, QueryRunner } from "typeorm";

export class FixNameFile1730493691169 implements MigrationInterface {
    name = 'FixNameFile1730493691169'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "info_workers" RENAME COLUMN "employment_end_date" TO "employment_start_date"`);
        await queryRunner.query(`ALTER TABLE "rules" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "time_sheets" ADD "extra_rates" json`);
        await queryRunner.query(`ALTER TABLE "info_workers" ALTER COLUMN "employment_start_date" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "extra_rules"."unit" IS 'Unidad de medida para el cargo: sku, pallet, etc.'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "extra_rules"."unit" IS NULL`);
        await queryRunner.query(`ALTER TABLE "info_workers" ALTER COLUMN "employment_start_date" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "time_sheets" DROP COLUMN "extra_rates"`);
        await queryRunner.query(`ALTER TABLE "rules" ADD "status" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "info_workers" RENAME COLUMN "employment_start_date" TO "employment_end_date"`);
    }

}
