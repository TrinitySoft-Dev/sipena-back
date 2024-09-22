import { MigrationInterface, QueryRunner } from "typeorm";

export class Products1727030163216 implements MigrationInterface {
    name = 'Products1727030163216'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "products" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "price" double precision NOT NULL, "item_code" character varying(60) NOT NULL, "active" boolean NOT NULL DEFAULT false, "created_at" date NOT NULL DEFAULT ('now'::text)::date, "updated_at" date NOT NULL DEFAULT ('now'::text)::date, "deleted_at" date, "customerId" integer, CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id")); COMMENT ON COLUMN "products"."active" IS 'User avatar'`);
        await queryRunner.query(`ALTER TABLE "rules" ADD "workId" integer`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_be9f5a8a97d003e4661c4c40527" FOREIGN KEY ("customerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rules" ADD CONSTRAINT "FK_5281a40fbe6280436468591f4cb" FOREIGN KEY ("workId") REFERENCES "works"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rules" DROP CONSTRAINT "FK_5281a40fbe6280436468591f4cb"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_be9f5a8a97d003e4661c4c40527"`);
        await queryRunner.query(`ALTER TABLE "rules" DROP COLUMN "workId"`);
        await queryRunner.query(`DROP TABLE "products"`);
    }

}
