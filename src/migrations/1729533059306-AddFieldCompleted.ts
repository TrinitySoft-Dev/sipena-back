import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFieldCompleted1729533059306 implements MigrationInterface {
    name = 'AddFieldCompleted1729533059306'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "info_workers" ADD "completed" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`COMMENT ON COLUMN "info_workers"."completed" IS 'Field to check if the user has completed the registration'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "info_workers"."completed" IS 'Field to check if the user has completed the registration'`);
        await queryRunner.query(`ALTER TABLE "info_workers" DROP COLUMN "completed"`);
    }

}
