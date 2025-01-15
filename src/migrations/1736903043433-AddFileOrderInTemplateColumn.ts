import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFileOrderInTemplateColumn1736903043433 implements MigrationInterface {
    name = 'AddFileOrderInTemplateColumn1736903043433'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "template_columns" ADD "order" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "info_workers" ALTER COLUMN "tfn" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "info_workers" ALTER COLUMN "abn" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "info_workers" ALTER COLUMN "bank_account_number" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "info_workers" ALTER COLUMN "bank_account_number" SET DEFAULT 'SIN_BANCO'`);
        await queryRunner.query(`ALTER TABLE "info_workers" ALTER COLUMN "abn" SET DEFAULT 'SIN_ABN'`);
        await queryRunner.query(`ALTER TABLE "info_workers" ALTER COLUMN "tfn" SET DEFAULT 'SIN_TFN'`);
        await queryRunner.query(`ALTER TABLE "template_columns" DROP COLUMN "order"`);
    }

}
