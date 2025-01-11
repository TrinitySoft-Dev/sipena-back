import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOvertimes1736256962450 implements MigrationInterface {
    name = 'AddOvertimes1736256962450'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "overtimes" ("id" SERIAL NOT NULL, "number" integer NOT NULL, "hours" integer NOT NULL, "rate" double precision NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "delete_at" TIMESTAMP, CONSTRAINT "PK_de9e03d219c6d91c5d7f746a1d5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "normal_schedule_overtimes_overtimes" ("normal_schedule_id" integer NOT NULL, "overtime_id" integer NOT NULL, CONSTRAINT "PK_6ca7c5e8311e14c8af1cc42e467" PRIMARY KEY ("normal_schedule_id", "overtime_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_32c651c883b0eeac0262701dba" ON "normal_schedule_overtimes_overtimes" ("normal_schedule_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_1a200c8ec948c31bde2f7884bf" ON "normal_schedule_overtimes_overtimes" ("overtime_id") `);
        await queryRunner.query(`ALTER TABLE "normal_schedule_overtimes_overtimes" ADD CONSTRAINT "FK_32c651c883b0eeac0262701dbac" FOREIGN KEY ("normal_schedule_id") REFERENCES "normal_schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "normal_schedule_overtimes_overtimes" ADD CONSTRAINT "FK_1a200c8ec948c31bde2f7884bf0" FOREIGN KEY ("overtime_id") REFERENCES "overtimes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "normal_schedule_overtimes_overtimes" DROP CONSTRAINT "FK_1a200c8ec948c31bde2f7884bf0"`);
        await queryRunner.query(`ALTER TABLE "normal_schedule_overtimes_overtimes" DROP CONSTRAINT "FK_32c651c883b0eeac0262701dbac"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1a200c8ec948c31bde2f7884bf"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_32c651c883b0eeac0262701dba"`);
        await queryRunner.query(`DROP TABLE "normal_schedule_overtimes_overtimes"`);
        await queryRunner.query(`DROP TABLE "overtimes"`);
    }

}
