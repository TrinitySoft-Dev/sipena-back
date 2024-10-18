import { MigrationInterface, QueryRunner } from "typeorm";

export class TimesheetWorkers1729200412965 implements MigrationInterface {
    name = 'TimesheetWorkers1729200412965'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "timesheet_workers" DROP CONSTRAINT "FK_3c3f061bcf28a1dbaeb24d73e91"`);
        await queryRunner.query(`ALTER TABLE "timesheet_workers" DROP CONSTRAINT "FK_ee8155e0c387eae85fc1ae422cb"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ee8155e0c387eae85fc1ae422c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3c3f061bcf28a1dbaeb24d73e9"`);
        await queryRunner.query(`ALTER TABLE "timesheet_workers" DROP CONSTRAINT "PK_c1e3ec6d609dba6e4e816c5e66d"`);
        await queryRunner.query(`ALTER TABLE "timesheet_workers" ADD CONSTRAINT "PK_3c3f061bcf28a1dbaeb24d73e91" PRIMARY KEY ("user_id")`);
        await queryRunner.query(`ALTER TABLE "timesheet_workers" DROP COLUMN "timesheet_id"`);
        await queryRunner.query(`ALTER TABLE "timesheet_workers" DROP CONSTRAINT "PK_3c3f061bcf28a1dbaeb24d73e91"`);
        await queryRunner.query(`ALTER TABLE "timesheet_workers" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "timesheet_workers" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "timesheet_workers" ADD CONSTRAINT "PK_61fb9ad2df76d4bd62f48bb3ba8" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "timesheet_workers" ADD "break" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "timesheet_workers" ADD "waiting_time" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "timesheet_workers" ADD "time" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "timesheet_workers" ADD "time_out" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "timesheet_workers" ADD "comment" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "timesheet_workers" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "timesheet_workers" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "timesheet_workers" ADD "workerId" integer`);
        await queryRunner.query(`ALTER TABLE "timesheet_workers" ADD "timesheetId" integer`);
        await queryRunner.query(`ALTER TABLE "timesheet_workers" ADD CONSTRAINT "FK_c806e7cacb813a7e71ce002047c" FOREIGN KEY ("workerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "timesheet_workers" ADD CONSTRAINT "FK_553ac225bc7060e454bf531c6b1" FOREIGN KEY ("timesheetId") REFERENCES "time_sheets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "timesheet_workers" DROP CONSTRAINT "FK_553ac225bc7060e454bf531c6b1"`);
        await queryRunner.query(`ALTER TABLE "timesheet_workers" DROP CONSTRAINT "FK_c806e7cacb813a7e71ce002047c"`);
        await queryRunner.query(`ALTER TABLE "timesheet_workers" DROP COLUMN "timesheetId"`);
        await queryRunner.query(`ALTER TABLE "timesheet_workers" DROP COLUMN "workerId"`);
        await queryRunner.query(`ALTER TABLE "timesheet_workers" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "timesheet_workers" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "timesheet_workers" DROP COLUMN "comment"`);
        await queryRunner.query(`ALTER TABLE "timesheet_workers" DROP COLUMN "time_out"`);
        await queryRunner.query(`ALTER TABLE "timesheet_workers" DROP COLUMN "time"`);
        await queryRunner.query(`ALTER TABLE "timesheet_workers" DROP COLUMN "waiting_time"`);
        await queryRunner.query(`ALTER TABLE "timesheet_workers" DROP COLUMN "break"`);
        await queryRunner.query(`ALTER TABLE "timesheet_workers" DROP CONSTRAINT "PK_61fb9ad2df76d4bd62f48bb3ba8"`);
        await queryRunner.query(`ALTER TABLE "timesheet_workers" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "timesheet_workers" ADD "user_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "timesheet_workers" ADD CONSTRAINT "PK_3c3f061bcf28a1dbaeb24d73e91" PRIMARY KEY ("user_id")`);
        await queryRunner.query(`ALTER TABLE "timesheet_workers" ADD "timesheet_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "timesheet_workers" DROP CONSTRAINT "PK_3c3f061bcf28a1dbaeb24d73e91"`);
        await queryRunner.query(`ALTER TABLE "timesheet_workers" ADD CONSTRAINT "PK_c1e3ec6d609dba6e4e816c5e66d" PRIMARY KEY ("timesheet_id", "user_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_3c3f061bcf28a1dbaeb24d73e9" ON "timesheet_workers" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_ee8155e0c387eae85fc1ae422c" ON "timesheet_workers" ("timesheet_id") `);
        await queryRunner.query(`ALTER TABLE "timesheet_workers" ADD CONSTRAINT "FK_ee8155e0c387eae85fc1ae422cb" FOREIGN KEY ("timesheet_id") REFERENCES "time_sheets"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "timesheet_workers" ADD CONSTRAINT "FK_3c3f061bcf28a1dbaeb24d73e91" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
