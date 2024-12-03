import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrateForId1733176360535 implements MigrationInterface {
    name = 'MigrateForId1733176360535'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "template_columns" DROP CONSTRAINT "FK_4046a7e8adb6ddc9841f3c89a6a"`);
        await queryRunner.query(`ALTER TABLE "template_columns" DROP COLUMN "templateId"`);
        await queryRunner.query(`ALTER TABLE "template_columns" ADD "templateId" integer`);
        await queryRunner.query(`ALTER TABLE "templates" DROP CONSTRAINT "PK_515948649ce0bbbe391de702ae5"`);
        await queryRunner.query(`ALTER TABLE "templates" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "templates" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "templates" ADD CONSTRAINT "PK_515948649ce0bbbe391de702ae5" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "template_columns" ADD CONSTRAINT "FK_4046a7e8adb6ddc9841f3c89a6a" FOREIGN KEY ("templateId") REFERENCES "templates"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "template_columns" DROP CONSTRAINT "FK_4046a7e8adb6ddc9841f3c89a6a"`);
        await queryRunner.query(`ALTER TABLE "templates" DROP CONSTRAINT "PK_515948649ce0bbbe391de702ae5"`);
        await queryRunner.query(`ALTER TABLE "templates" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "templates" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "templates" ADD CONSTRAINT "PK_515948649ce0bbbe391de702ae5" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "template_columns" DROP COLUMN "templateId"`);
        await queryRunner.query(`ALTER TABLE "template_columns" ADD "templateId" uuid`);
        await queryRunner.query(`ALTER TABLE "template_columns" ADD CONSTRAINT "FK_4046a7e8adb6ddc9841f3c89a6a" FOREIGN KEY ("templateId") REFERENCES "templates"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
