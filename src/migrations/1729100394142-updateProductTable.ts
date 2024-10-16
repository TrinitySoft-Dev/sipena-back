import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateProductTable1729100394142 implements MigrationInterface {
    name = 'UpdateProductTable1729100394142'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "item_code" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "item_code" SET NOT NULL`);
    }

}
