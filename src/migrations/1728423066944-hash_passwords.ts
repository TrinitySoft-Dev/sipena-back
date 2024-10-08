import { MigrationInterface, QueryRunner } from "typeorm";

export class HashPasswords1728423066944 implements MigrationInterface {
    name = 'HashPasswords1728423066944'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "password_hashes" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "token" character varying(64) NOT NULL, "expires" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_924fc6159ab0a0f0e2ffc8efb62" UNIQUE ("token"), CONSTRAINT "PK_ec3c5d7e6d708b6d7864638b3fa" PRIMARY KEY ("id")); COMMENT ON COLUMN "password_hashes"."created_at" IS 'Timesheet created at'; COMMENT ON COLUMN "password_hashes"."updated_at" IS 'Timesheet updated at'`);
        await queryRunner.query(`CREATE INDEX "IDX_924fc6159ab0a0f0e2ffc8efb6" ON "password_hashes" ("token") `);
        await queryRunner.query(`ALTER TABLE "container_sizes" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "container_sizes" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "container_sizes" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "container_sizes" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "password_hashes" ADD CONSTRAINT "FK_71aea4e4a394ab2106bab504f7b" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "password_hashes" DROP CONSTRAINT "FK_71aea4e4a394ab2106bab504f7b"`);
        await queryRunner.query(`ALTER TABLE "container_sizes" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "container_sizes" ADD "updated_at" date NOT NULL DEFAULT ('now'::text)::date`);
        await queryRunner.query(`ALTER TABLE "container_sizes" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "container_sizes" ADD "created_at" date NOT NULL DEFAULT ('now'::text)::date`);
        await queryRunner.query(`DROP INDEX "public"."IDX_924fc6159ab0a0f0e2ffc8efb6"`);
        await queryRunner.query(`DROP TABLE "password_hashes"`);
    }

}
