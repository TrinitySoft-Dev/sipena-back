import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLong1736991173194 implements MigrationInterface {
    name = 'AddLong1736991173194'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "template_columns" DROP COLUMN "value_cell_html"`);
        await queryRunner.query(`ALTER TABLE "template_columns" ADD "value_cell_html" character varying(500)`);
        await queryRunner.query(`ALTER TABLE "template_columns" ALTER COLUMN "order" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "template_columns" ALTER COLUMN "order" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "template_columns" ALTER COLUMN "order" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "template_columns" ALTER COLUMN "order" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "template_columns" DROP COLUMN "value_cell_html"`);
        await queryRunner.query(`ALTER TABLE "template_columns" ADD "value_cell_html" character varying(255)`);
    }

}
