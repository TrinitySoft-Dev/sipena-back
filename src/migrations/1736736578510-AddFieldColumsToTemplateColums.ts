import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFieldColumsToTemplateColums1736736578510 implements MigrationInterface {
    name = 'AddFieldColumsToTemplateColums1736736578510'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "template_columns" ADD "order" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "template_columns" DROP COLUMN "order"`);
    }

}
