import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeLongValueCell1738108124577 implements MigrationInterface {
    name = 'ChangeLongValueCell1738108124577'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "template_columns" DROP COLUMN "value_cell_html"`);
        await queryRunner.query(`ALTER TABLE "template_columns" ADD "value_cell_html" character varying(2000)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "template_columns" DROP COLUMN "value_cell_html"`);
        await queryRunner.query(`ALTER TABLE "template_columns" ADD "value_cell_html" character varying(500)`);
    }

}
