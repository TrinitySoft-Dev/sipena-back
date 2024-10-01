import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationConditions1727715312101 implements MigrationInterface {
    name = 'MigrationConditions1727715312101'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "container_sizes" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "container_sizes" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "container_sizes" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "container_sizes" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "container_sizes" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "container_sizes" ADD "updated_at" date NOT NULL DEFAULT ('now'::text)::date`);
        await queryRunner.query(`ALTER TABLE "container_sizes" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "container_sizes" ADD "created_at" date NOT NULL DEFAULT ('now'::text)::date`);
    }

}
