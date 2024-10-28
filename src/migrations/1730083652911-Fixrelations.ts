import { MigrationInterface, QueryRunner } from "typeorm";

export class Fixrelations1730083652911 implements MigrationInterface {
    name = 'Fixrelations1730083652911'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "rules_extra_rules" ("rules_id" integer NOT NULL, "extra_rule_id" integer NOT NULL, CONSTRAINT "PK_51b07a0b718f281357843e78e55" PRIMARY KEY ("rules_id", "extra_rule_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8b5b1754edd2a09ebf372bcaad" ON "rules_extra_rules" ("rules_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_effdb213fb524f2e199f2d69a3" ON "rules_extra_rules" ("extra_rule_id") `);
        await queryRunner.query(`ALTER TABLE "conditions" DROP COLUMN "mandatory"`);
        await queryRunner.query(`ALTER TABLE "rules_extra_rules" ADD CONSTRAINT "FK_8b5b1754edd2a09ebf372bcaadb" FOREIGN KEY ("rules_id") REFERENCES "rules"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "rules_extra_rules" ADD CONSTRAINT "FK_effdb213fb524f2e199f2d69a3e" FOREIGN KEY ("extra_rule_id") REFERENCES "extra_rules"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rules_extra_rules" DROP CONSTRAINT "FK_effdb213fb524f2e199f2d69a3e"`);
        await queryRunner.query(`ALTER TABLE "rules_extra_rules" DROP CONSTRAINT "FK_8b5b1754edd2a09ebf372bcaadb"`);
        await queryRunner.query(`ALTER TABLE "conditions" ADD "mandatory" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`DROP INDEX "public"."IDX_effdb213fb524f2e199f2d69a3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8b5b1754edd2a09ebf372bcaad"`);
        await queryRunner.query(`DROP TABLE "rules_extra_rules"`);
    }

}
