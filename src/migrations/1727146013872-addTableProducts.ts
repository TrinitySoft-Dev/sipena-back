import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTableProducts1727146013872 implements MigrationInterface {
    name = 'AddTableProducts1727146013872'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "products" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "price" numeric NOT NULL, "item_code" character varying(255) NOT NULL, "active" boolean NOT NULL DEFAULT true, "created_at" date NOT NULL DEFAULT ('now'::text)::date, "updated_at" date NOT NULL DEFAULT ('now'::text)::date, CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "rules" ADD "work_id" integer`);
        await queryRunner.query(`ALTER TABLE "rules" ADD CONSTRAINT "FK_a72bca77095e8b02cee40a1de0c" FOREIGN KEY ("work_id") REFERENCES "works"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rules" DROP CONSTRAINT "FK_a72bca77095e8b02cee40a1de0c"`);
        await queryRunner.query(`ALTER TABLE "rules" DROP COLUMN "work_id"`);
        await queryRunner.query(`DROP TABLE "products"`);
    }

}
