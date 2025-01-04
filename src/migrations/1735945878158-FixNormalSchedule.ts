import { MigrationInterface, QueryRunner } from "typeorm";

export class FixNormalSchedule1735945878158 implements MigrationInterface {
    name = 'FixNormalSchedule1735945878158'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "normal_schedule" DROP CONSTRAINT "FK_d0c6efba0dde51e9f13a40c129f"`);
        await queryRunner.query(`CREATE TABLE "normal_schedule_customer_users" ("normal_schedule_id" integer NOT NULL, "customer_id" integer NOT NULL, CONSTRAINT "PK_87d4926ba28b1deb101ac732f59" PRIMARY KEY ("normal_schedule_id", "customer_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_0fc454dc3b32fb1c767698aa70" ON "normal_schedule_customer_users" ("normal_schedule_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_298c9f4e1fb78eb6da9f2fc793" ON "normal_schedule_customer_users" ("customer_id") `);
        await queryRunner.query(`ALTER TABLE "normal_schedule" DROP CONSTRAINT "UQ_d0c6efba0dde51e9f13a40c129f"`);
        await queryRunner.query(`ALTER TABLE "normal_schedule" DROP COLUMN "customerId"`);
        await queryRunner.query(`ALTER TABLE "normal_schedule_customer_users" ADD CONSTRAINT "FK_0fc454dc3b32fb1c767698aa70e" FOREIGN KEY ("normal_schedule_id") REFERENCES "normal_schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "normal_schedule_customer_users" ADD CONSTRAINT "FK_298c9f4e1fb78eb6da9f2fc7937" FOREIGN KEY ("customer_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "normal_schedule_customer_users" DROP CONSTRAINT "FK_298c9f4e1fb78eb6da9f2fc7937"`);
        await queryRunner.query(`ALTER TABLE "normal_schedule_customer_users" DROP CONSTRAINT "FK_0fc454dc3b32fb1c767698aa70e"`);
        await queryRunner.query(`ALTER TABLE "normal_schedule" ADD "customerId" integer`);
        await queryRunner.query(`ALTER TABLE "normal_schedule" ADD CONSTRAINT "UQ_d0c6efba0dde51e9f13a40c129f" UNIQUE ("customerId")`);
        await queryRunner.query(`DROP INDEX "public"."IDX_298c9f4e1fb78eb6da9f2fc793"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0fc454dc3b32fb1c767698aa70"`);
        await queryRunner.query(`DROP TABLE "normal_schedule_customer_users"`);
        await queryRunner.query(`ALTER TABLE "normal_schedule" ADD CONSTRAINT "FK_d0c6efba0dde51e9f13a40c129f" FOREIGN KEY ("customerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
