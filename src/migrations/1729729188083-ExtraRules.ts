import { MigrationInterface, QueryRunner } from "typeorm";

export class ExtraRules1729729188083 implements MigrationInterface {
    name = 'ExtraRules1729729188083'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "extra_rules" ("id" SERIAL NOT NULL, "name" character varying(60) NOT NULL, "rate" numeric NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f1e1118cf2e7f3f65105b820223" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "customers_extra_rules" ("customers_id" integer NOT NULL, "extra_rule_id" integer NOT NULL, CONSTRAINT "PK_b33453ffe592818487b614376b2" PRIMARY KEY ("customers_id", "extra_rule_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_bc0947b96b143ef3f491e5fbd1" ON "customers_extra_rules" ("customers_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_4c85469e898ae800f1e82d2915" ON "customers_extra_rules" ("extra_rule_id") `);
        await queryRunner.query(`ALTER TABLE "condition_groups" ADD "extraRuleId" integer`);
        await queryRunner.query(`ALTER TABLE "condition_groups" ADD CONSTRAINT "FK_30e1bc3a4f935d17e03a8d95e92" FOREIGN KEY ("extraRuleId") REFERENCES "extra_rules"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customers_extra_rules" ADD CONSTRAINT "FK_bc0947b96b143ef3f491e5fbd18" FOREIGN KEY ("customers_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "customers_extra_rules" ADD CONSTRAINT "FK_4c85469e898ae800f1e82d2915f" FOREIGN KEY ("extra_rule_id") REFERENCES "rules"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customers_extra_rules" DROP CONSTRAINT "FK_4c85469e898ae800f1e82d2915f"`);
        await queryRunner.query(`ALTER TABLE "customers_extra_rules" DROP CONSTRAINT "FK_bc0947b96b143ef3f491e5fbd18"`);
        await queryRunner.query(`ALTER TABLE "condition_groups" DROP CONSTRAINT "FK_30e1bc3a4f935d17e03a8d95e92"`);
        await queryRunner.query(`ALTER TABLE "condition_groups" DROP COLUMN "extraRuleId"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4c85469e898ae800f1e82d2915"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bc0947b96b143ef3f491e5fbd1"`);
        await queryRunner.query(`DROP TABLE "customers_extra_rules"`);
        await queryRunner.query(`DROP TABLE "extra_rules"`);
    }

}
