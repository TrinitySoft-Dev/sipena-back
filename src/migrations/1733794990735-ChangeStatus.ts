import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeStatus1733794990735 implements MigrationInterface {
    name = 'ChangeStatus1733794990735'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "time_sheets" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."time_sheets_status_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."time_sheets_status_worker_pay_enum" AS ENUM('OPEN', 'CLOSED')`);
        await queryRunner.query(`ALTER TABLE "time_sheets" ADD "status_worker_pay" "public"."time_sheets_status_worker_pay_enum" NOT NULL DEFAULT 'OPEN'`);
        await queryRunner.query(`CREATE TYPE "public"."time_sheets_status_customer_pay_enum" AS ENUM('OPEN', 'CLOSED')`);
        await queryRunner.query(`ALTER TABLE "time_sheets" ADD "status_customer_pay" "public"."time_sheets_status_customer_pay_enum" NOT NULL DEFAULT 'OPEN'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "time_sheets" DROP COLUMN "status_customer_pay"`);
        await queryRunner.query(`DROP TYPE "public"."time_sheets_status_customer_pay_enum"`);
        await queryRunner.query(`ALTER TABLE "time_sheets" DROP COLUMN "status_worker_pay"`);
        await queryRunner.query(`DROP TYPE "public"."time_sheets_status_worker_pay_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."time_sheets_status_enum" AS ENUM('OPEN', 'CLOSED')`);
        await queryRunner.query(`ALTER TABLE "time_sheets" ADD "status" "public"."time_sheets_status_enum" NOT NULL DEFAULT 'OPEN'`);
    }

}
