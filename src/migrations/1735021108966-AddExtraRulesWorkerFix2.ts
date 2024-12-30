import { MigrationInterface, QueryRunner } from "typeorm";

export class AddExtraRulesWorkerFix21735021108966 implements MigrationInterface {
    name = 'AddExtraRulesWorkerFix21735021108966'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "condition_groups" DROP CONSTRAINT "FK_22d1e03f87c7cbee43fb8b2f2c1"`);
        await queryRunner.query(`ALTER TABLE "condition_groups" ADD CONSTRAINT "FK_22d1e03f87c7cbee43fb8b2f2c1" FOREIGN KEY ("extraRuleWorkersId") REFERENCES "extra_rules_workers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "condition_groups" DROP CONSTRAINT "FK_22d1e03f87c7cbee43fb8b2f2c1"`);
        await queryRunner.query(`ALTER TABLE "condition_groups" ADD CONSTRAINT "FK_22d1e03f87c7cbee43fb8b2f2c1" FOREIGN KEY ("extraRuleWorkersId") REFERENCES "rules_worker"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
