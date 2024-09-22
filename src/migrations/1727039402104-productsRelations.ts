import { MigrationInterface, QueryRunner } from "typeorm";

export class ProductsRelations1727039402104 implements MigrationInterface {
    name = 'ProductsRelations1727039402104'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_be9f5a8a97d003e4661c4c40527"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "customerId"`);
        await queryRunner.query(`ALTER TABLE "rules" ADD "workId" integer`);
        await queryRunner.query(`ALTER TABLE "users" ADD "productsId" integer`);
        await queryRunner.query(`ALTER TABLE "rules" ADD CONSTRAINT "FK_5281a40fbe6280436468591f4cb" FOREIGN KEY ("workId") REFERENCES "works"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_9e9662808426cca2f97d6526c58" FOREIGN KEY ("productsId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_9e9662808426cca2f97d6526c58"`);
        await queryRunner.query(`ALTER TABLE "rules" DROP CONSTRAINT "FK_5281a40fbe6280436468591f4cb"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "productsId"`);
        await queryRunner.query(`ALTER TABLE "rules" DROP COLUMN "workId"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "customerId" integer`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_be9f5a8a97d003e4661c4c40527" FOREIGN KEY ("customerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
