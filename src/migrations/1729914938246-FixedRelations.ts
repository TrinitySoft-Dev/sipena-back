import { MigrationInterface, QueryRunner } from "typeorm";

export class FixedRelations1729914938246 implements MigrationInterface {
    name = 'FixedRelations1729914938246'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customers_extra_rules" DROP CONSTRAINT "FK_4c85469e898ae800f1e82d2915f"`);
        await queryRunner.query(`ALTER TABLE "customers_extra_rules" ADD CONSTRAINT "FK_4c85469e898ae800f1e82d2915f" FOREIGN KEY ("extra_rule_id") REFERENCES "extra_rules"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customers_extra_rules" DROP CONSTRAINT "FK_4c85469e898ae800f1e82d2915f"`);
        await queryRunner.query(`ALTER TABLE "customers_extra_rules" ADD CONSTRAINT "FK_4c85469e898ae800f1e82d2915f" FOREIGN KEY ("extra_rule_id") REFERENCES "rules"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
