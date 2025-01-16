import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFieldValueCellHtml1736952301510 implements MigrationInterface {
    name = 'AddFieldValueCellHtml1736952301510'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "template_columns" ADD "value_cell_html" character varying(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "template_columns" DROP COLUMN "value_cell_html"`);
    }

}
