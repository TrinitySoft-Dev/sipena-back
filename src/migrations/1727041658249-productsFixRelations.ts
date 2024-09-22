import { MigrationInterface, QueryRunner } from "typeorm";

export class ProductsFixRelations1727041658249 implements MigrationInterface {
    name = 'ProductsFixRelations1727041658249'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_products" ("user_id" integer NOT NULL, "product_id" integer NOT NULL, CONSTRAINT "PK_b9470e455b81e2f0bc0d32f269f" PRIMARY KEY ("user_id", "product_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_494f0246efbe65076d1051c653" ON "user_products" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_1c5a5dc69b4ac2b5ee47568477" ON "user_products" ("product_id") `);
        await queryRunner.query(`ALTER TABLE "rules" ADD "workId" integer`);
        await queryRunner.query(`ALTER TABLE "rules" ADD CONSTRAINT "FK_5281a40fbe6280436468591f4cb" FOREIGN KEY ("workId") REFERENCES "works"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_products" ADD CONSTRAINT "FK_494f0246efbe65076d1051c6539" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_products" ADD CONSTRAINT "FK_1c5a5dc69b4ac2b5ee475684779" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_products" DROP CONSTRAINT "FK_1c5a5dc69b4ac2b5ee475684779"`);
        await queryRunner.query(`ALTER TABLE "user_products" DROP CONSTRAINT "FK_494f0246efbe65076d1051c6539"`);
        await queryRunner.query(`ALTER TABLE "rules" DROP CONSTRAINT "FK_5281a40fbe6280436468591f4cb"`);
        await queryRunner.query(`ALTER TABLE "rules" DROP COLUMN "workId"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1c5a5dc69b4ac2b5ee47568477"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_494f0246efbe65076d1051c653"`);
        await queryRunner.query(`DROP TABLE "user_products"`);
    }

}
