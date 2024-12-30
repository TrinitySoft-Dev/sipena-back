import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRelationExtraRuleWorker1735020322518 implements MigrationInterface {
    name = 'AddRelationExtraRuleWorker1735020322518'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "extra_rules_workers" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "rate" double precision NOT NULL, "rate_type" character varying(100) NOT NULL, "payment_type" character varying(100) NOT NULL, "active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "delete_at" TIMESTAMP, CONSTRAINT "PK_28c64488bd8132e175b8456a9c9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "rules_worker_extra_rules_worker" ("rules_worker_id" integer NOT NULL, "extra_rules_worker_id" integer NOT NULL, CONSTRAINT "PK_afd18d647f21725744af2f01a2a" PRIMARY KEY ("rules_worker_id", "extra_rules_worker_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b8f24fd0b4080ebf19c14c5364" ON "rules_worker_extra_rules_worker" ("rules_worker_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_1e7e1c7e6c33ead86a57133817" ON "rules_worker_extra_rules_worker" ("extra_rules_worker_id") `);
        await queryRunner.query(`ALTER TABLE "condition_groups" ADD "extraRuleWorkersId" integer`);
        await queryRunner.query(`ALTER TABLE "condition_groups" ADD CONSTRAINT "FK_22d1e03f87c7cbee43fb8b2f2c1" FOREIGN KEY ("extraRuleWorkersId") REFERENCES "rules_worker"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rules_worker_extra_rules_worker" ADD CONSTRAINT "FK_b8f24fd0b4080ebf19c14c5364e" FOREIGN KEY ("rules_worker_id") REFERENCES "rules_worker"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "rules_worker_extra_rules_worker" ADD CONSTRAINT "FK_1e7e1c7e6c33ead86a571338176" FOREIGN KEY ("extra_rules_worker_id") REFERENCES "extra_rules_workers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rules_worker_extra_rules_worker" DROP CONSTRAINT "FK_1e7e1c7e6c33ead86a571338176"`);
        await queryRunner.query(`ALTER TABLE "rules_worker_extra_rules_worker" DROP CONSTRAINT "FK_b8f24fd0b4080ebf19c14c5364e"`);
        await queryRunner.query(`ALTER TABLE "condition_groups" DROP CONSTRAINT "FK_22d1e03f87c7cbee43fb8b2f2c1"`);
        await queryRunner.query(`ALTER TABLE "condition_groups" DROP COLUMN "extraRuleWorkersId"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1e7e1c7e6c33ead86a57133817"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b8f24fd0b4080ebf19c14c5364"`);
        await queryRunner.query(`DROP TABLE "rules_worker_extra_rules_worker"`);
        await queryRunner.query(`DROP TABLE "extra_rules_workers"`);
    }

}
