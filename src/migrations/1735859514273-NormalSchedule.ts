import { MigrationInterface, QueryRunner } from "typeorm";

export class NormalSchedule1735859514273 implements MigrationInterface {
    name = 'NormalSchedule1735859514273'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "normal_schedule" ("id" SERIAL NOT NULL, "days" text array NOT NULL, "up_hours" integer NOT NULL, "rate" double precision NOT NULL, "active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "delete_at" TIMESTAMP, "workId" integer, CONSTRAINT "PK_a1f3fe7d5d242dad597c01da1fb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "normal_schedule" ADD CONSTRAINT "FK_b03f463c5f1d22a3e93e40aab9f" FOREIGN KEY ("workId") REFERENCES "works"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "normal_schedule" DROP CONSTRAINT "FK_b03f463c5f1d22a3e93e40aab9f"`);
        await queryRunner.query(`DROP TABLE "normal_schedule"`);
    }

}
