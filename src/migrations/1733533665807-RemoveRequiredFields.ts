import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveRequiredFields1733533665807 implements MigrationInterface {
    name = 'RemoveRequiredFields1733533665807'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "containers" ALTER COLUMN "container_number" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "containers" ALTER COLUMN "skus" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "containers" ALTER COLUMN "cartons" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "containers" ALTER COLUMN "pallets" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "containers" ALTER COLUMN "weight" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "containers" ALTER COLUMN "forklift_driver" SET DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "containers" ALTER COLUMN "trash" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "containers" ALTER COLUMN "mixed" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "containers" ALTER COLUMN "total_time" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "containers" ALTER COLUMN "plt_time_min" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "containers" ALTER COLUMN "plt_time_min" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "containers" ALTER COLUMN "total_time" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "containers" ALTER COLUMN "mixed" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "containers" ALTER COLUMN "trash" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "containers" ALTER COLUMN "forklift_driver" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "containers" ALTER COLUMN "weight" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "containers" ALTER COLUMN "pallets" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "containers" ALTER COLUMN "cartons" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "containers" ALTER COLUMN "skus" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "containers" ALTER COLUMN "container_number" SET NOT NULL`);
    }

}
