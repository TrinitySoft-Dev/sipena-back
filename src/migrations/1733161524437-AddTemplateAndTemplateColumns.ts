import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTemplateAndTemplateColumns1733161524437 implements MigrationInterface {
    name = 'AddTemplateAndTemplateColumns1733161524437'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "templates" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_515948649ce0bbbe391de702ae5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "template_columns" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "default_value" character varying(100), "select_field" character varying(100), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "templateId" uuid, CONSTRAINT "PK_239f422a3e3025d8b3881d628fd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "template_columns" ADD CONSTRAINT "FK_4046a7e8adb6ddc9841f3c89a6a" FOREIGN KEY ("templateId") REFERENCES "templates"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "template_columns" DROP CONSTRAINT "FK_4046a7e8adb6ddc9841f3c89a6a"`);
        await queryRunner.query(`DROP TABLE "template_columns"`);
        await queryRunner.query(`DROP TABLE "templates"`);
    }

}
