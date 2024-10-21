import { MigrationInterface, QueryRunner } from "typeorm";

export class FixCompletedFile1729534634388 implements MigrationInterface {
    name = 'FixCompletedFile1729534634388'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "info_workers" DROP COLUMN "completed"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "completed" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`COMMENT ON COLUMN "users"."completed" IS 'Field to check if the user has completed the registration'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "users"."completed" IS 'Field to check if the user has completed the registration'`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "completed"`);
        await queryRunner.query(`ALTER TABLE "info_workers" ADD "completed" boolean NOT NULL DEFAULT false`);
    }

}
