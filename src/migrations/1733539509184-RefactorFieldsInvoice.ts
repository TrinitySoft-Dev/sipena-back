import { MigrationInterface, QueryRunner } from "typeorm";

export class RefactorFieldsInvoice1733539509184 implements MigrationInterface {
    name = 'RefactorFieldsInvoice1733539509184'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "template_columns" DROP COLUMN "default_value"`);
        await queryRunner.query(`ALTER TABLE "template_columns" DROP COLUMN "select_field"`);
        await queryRunner.query(`ALTER TABLE "template_columns" ADD "value_cell" character varying(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "template_columns" DROP COLUMN "value_cell"`);
        await queryRunner.query(`ALTER TABLE "template_columns" ADD "select_field" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "template_columns" ADD "default_value" character varying(100)`);
    }

}
