import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRateWorkerInNormalSchedule1736277994415 implements MigrationInterface {
    name = 'AddRateWorkerInNormalSchedule1736277994415'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "normal_schedule" ADD "rate_worker" double precision NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "normal_schedule" DROP COLUMN "rate_worker"`);
    }

}
