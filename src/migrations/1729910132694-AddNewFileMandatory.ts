import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNewFileMandatory1729910132694 implements MigrationInterface {
    name = 'AddNewFileMandatory1729910132694'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "conditions" ADD "mandatory" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`COMMENT ON COLUMN "conditions"."mandatory" IS 'Indicates if the rule is mandatory'`);
        await queryRunner.query(`ALTER TABLE "extra_rules" ADD "rate_type" character varying(20) NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "extra_rules"."rate_type" IS 'Tipo de tarfia: porcentaje, fijo, por unidad'`);
        await queryRunner.query(`ALTER TABLE "extra_rules" ADD "unit" character varying(20) NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "extra_rules"."unit" IS 'Unidad de medida para el cargo: sku, pallet, etc.'`);
        await queryRunner.query(`ALTER TABLE "extra_rules" ADD "limit" integer`);
        await queryRunner.query(`COMMENT ON COLUMN "extra_rules"."limit" IS 'Límite para la unidad especificada'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "extra_rules"."limit" IS 'Límite para la unidad especificada'`);
        await queryRunner.query(`ALTER TABLE "extra_rules" DROP COLUMN "limit"`);
        await queryRunner.query(`COMMENT ON COLUMN "extra_rules"."unit" IS 'Unidad de medida para el cargo: sku, pallet, etc.'`);
        await queryRunner.query(`ALTER TABLE "extra_rules" DROP COLUMN "unit"`);
        await queryRunner.query(`COMMENT ON COLUMN "extra_rules"."rate_type" IS 'Tipo de tarfia: porcentaje, fijo, por unidad'`);
        await queryRunner.query(`ALTER TABLE "extra_rules" DROP COLUMN "rate_type"`);
        await queryRunner.query(`COMMENT ON COLUMN "conditions"."mandatory" IS 'Indicates if the rule is mandatory'`);
        await queryRunner.query(`ALTER TABLE "conditions" DROP COLUMN "mandatory"`);
    }

}
