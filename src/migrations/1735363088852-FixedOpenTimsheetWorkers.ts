import { MigrationInterface, QueryRunner } from "typeorm";

export class FixedOpenTimsheetWorkers1735363088852 implements MigrationInterface {
    name = 'FixedOpenTimsheetWorkers1735363088852'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "time_sheets" DROP COLUMN "status_worker_pay"`);
        await queryRunner.query(`DROP TYPE "public"."time_sheets_status_worker_pay_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."timesheet_workers_status_worker_pay_enum" AS ENUM('OPEN', 'CLOSED')`);
        await queryRunner.query(`ALTER TABLE "timesheet_workers" ADD "status_worker_pay" "public"."timesheet_workers_status_worker_pay_enum" NOT NULL DEFAULT 'OPEN'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "timesheet_workers" DROP COLUMN "status_worker_pay"`);
        await queryRunner.query(`DROP TYPE "public"."timesheet_workers_status_worker_pay_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."time_sheets_status_worker_pay_enum" AS ENUM('OPEN', 'CLOSED')`);
        await queryRunner.query(`ALTER TABLE "time_sheets" ADD "status_worker_pay" "public"."time_sheets_status_worker_pay_enum" NOT NULL DEFAULT 'OPEN'`);
    }

}
