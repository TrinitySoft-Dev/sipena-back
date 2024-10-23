import { MigrationInterface, QueryRunner } from "typeorm";

export class RelationsProductAndContainer1729640559318 implements MigrationInterface {
    name = 'RelationsProductAndContainer1729640559318'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "containers" RENAME COLUMN "product" TO "productId"`);
        await queryRunner.query(`ALTER TABLE "time_sheets" DROP COLUMN "comments"`);
        await queryRunner.query(`ALTER TABLE "containers" DROP COLUMN "productId"`);
        await queryRunner.query(`ALTER TABLE "containers" ADD "productId" integer`);
        await queryRunner.query(`ALTER TABLE "containers" ADD CONSTRAINT "FK_d00fe196d263909603476d9dd34" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "containers" DROP CONSTRAINT "FK_d00fe196d263909603476d9dd34"`);
        await queryRunner.query(`ALTER TABLE "containers" DROP COLUMN "productId"`);
        await queryRunner.query(`ALTER TABLE "containers" ADD "productId" character varying(40) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "time_sheets" ADD "comments" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "containers" RENAME COLUMN "productId" TO "product"`);
    }

}
