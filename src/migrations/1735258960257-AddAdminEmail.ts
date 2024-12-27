import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAdminEmail1735258960257 implements MigrationInterface {
    name = 'AddAdminEmail1735258960257'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "admin_emails" ("id" SERIAL NOT NULL, "email" character varying(255) NOT NULL, "active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "delete_at" TIMESTAMP, CONSTRAINT "PK_cefd66046ecf1b4739fc0f61907" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "active" SET DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "active" SET DEFAULT true`);
        await queryRunner.query(`DROP TABLE "admin_emails"`);
    }

}
