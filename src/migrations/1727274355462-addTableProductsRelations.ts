import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTableProductsRelations1727274355462 implements MigrationInterface {
    name = 'AddTableProductsRelations1727274355462'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rules" ADD "work_id" integer`);
        await queryRunner.query(`ALTER TABLE "rules" ADD CONSTRAINT "FK_a72bca77095e8b02cee40a1de0c" FOREIGN KEY ("work_id") REFERENCES "works"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_products" ADD CONSTRAINT "FK_1c5a5dc69b4ac2b5ee475684779" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_products" DROP CONSTRAINT "FK_1c5a5dc69b4ac2b5ee475684779"`);
        await queryRunner.query(`ALTER TABLE "rules" DROP CONSTRAINT "FK_a72bca77095e8b02cee40a1de0c"`);
        await queryRunner.query(`ALTER TABLE "rules" DROP COLUMN "work_id"`);
    }

}
