import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRuleWorker1732552407852 implements MigrationInterface {
    name = 'AddRuleWorker1732552407852'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "rules_worker" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "rate" double precision NOT NULL, "rate_type" character varying(100) NOT NULL, "work" character varying(100) NOT NULL, "active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "delete_at" TIMESTAMP, "containerSizeId" integer, CONSTRAINT "PK_dec193ada8811e267985fd670e6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "rules_worker" ADD CONSTRAINT "FK_7ce67eb631db14f48ff0459cbe5" FOREIGN KEY ("containerSizeId") REFERENCES "container_sizes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rules_worker" DROP CONSTRAINT "FK_7ce67eb631db14f48ff0459cbe5"`);
        await queryRunner.query(`DROP TABLE "rules_worker"`);
    }

}
