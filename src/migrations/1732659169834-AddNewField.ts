import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNewField1732659169834 implements MigrationInterface {
    name = 'AddNewField1732659169834'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "condition_groups" DROP CONSTRAINT "FK_e4db09974b4e6de7b6ba4bcfd39"`);
        await queryRunner.query(`ALTER TABLE "condition_groups" DROP COLUMN "ruleWorkersId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "condition_groups" ADD "ruleWorkersId" integer`);
        await queryRunner.query(`ALTER TABLE "condition_groups" ADD CONSTRAINT "FK_e4db09974b4e6de7b6ba4bcfd39" FOREIGN KEY ("ruleWorkersId") REFERENCES "rules_worker"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
