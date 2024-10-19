import { MigrationInterface, QueryRunner } from "typeorm";

export class FixedProducts1729318088240 implements MigrationInterface {
    name = 'FixedProducts1729318088240'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users_products_products" ("usersId" integer NOT NULL, "productsId" integer NOT NULL, CONSTRAINT "PK_2afd1e49d5e0313b15aee86424f" PRIMARY KEY ("usersId", "productsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_aca61847cb6726b22e1fd4020b" ON "users_products_products" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_f3f6ee991534b7dfa039912c3f" ON "users_products_products" ("productsId") `);
        await queryRunner.query(`ALTER TABLE "users_products_products" ADD CONSTRAINT "FK_aca61847cb6726b22e1fd4020bc" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users_products_products" ADD CONSTRAINT "FK_f3f6ee991534b7dfa039912c3fd" FOREIGN KEY ("productsId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_products_products" DROP CONSTRAINT "FK_f3f6ee991534b7dfa039912c3fd"`);
        await queryRunner.query(`ALTER TABLE "users_products_products" DROP CONSTRAINT "FK_aca61847cb6726b22e1fd4020bc"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f3f6ee991534b7dfa039912c3f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_aca61847cb6726b22e1fd4020b"`);
        await queryRunner.query(`DROP TABLE "users_products_products"`);
    }

}
