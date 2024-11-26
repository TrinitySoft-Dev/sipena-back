import { MigrationInterface, QueryRunner } from "typeorm";

export class FixRelations1732554013037 implements MigrationInterface {
    name = 'FixRelations1732554013037'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "condition_groups" ADD "ruleWorkersId" integer`);
        await queryRunner.query(`ALTER TABLE "condition_groups" ADD CONSTRAINT "FK_e4db09974b4e6de7b6ba4bcfd39" FOREIGN KEY ("ruleWorkersId") REFERENCES "rules_worker"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "condition_groups" DROP CONSTRAINT "FK_e4db09974b4e6de7b6ba4bcfd39"`);
        await queryRunner.query(`ALTER TABLE "condition_groups" DROP COLUMN "ruleWorkersId"`);
    }

}
