import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFieldExtraRulesInTimesheetWorkers1735361617186 implements MigrationInterface {
    name = 'AddFieldExtraRulesInTimesheetWorkers1735361617186'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "timesheet_workers" ADD "extra_rules" json`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "timesheet_workers" DROP COLUMN "extra_rules"`);
    }

}
