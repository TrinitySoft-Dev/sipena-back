import { MigrationInterface, QueryRunner } from "typeorm";

export class AddWorkerOvertimes1736477652373 implements MigrationInterface {
    name = 'AddWorkerOvertimes1736477652373'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "overtimes_workers" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "rate" double precision NOT NULL, "hours" integer NOT NULL, "overtime_number" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "delete_at" TIMESTAMP, CONSTRAINT "PK_fa680d3bb95aaad9d4cc3165633" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "overtimes_workers"`);
    }

}
