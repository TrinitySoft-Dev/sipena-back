import { MigrationInterface, QueryRunner } from "typeorm";

export class ConditionsMigrations1729023120077 implements MigrationInterface {
    name = 'ConditionsMigrations1729023120077'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "conditions" DROP CONSTRAINT "FK_69cd70985a1f2e0594a24805c94"`);
        await queryRunner.query(`ALTER TABLE "conditions" ADD CONSTRAINT "FK_69cd70985a1f2e0594a24805c94" FOREIGN KEY ("condition_group_id") REFERENCES "condition_groups"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "conditions" DROP CONSTRAINT "FK_69cd70985a1f2e0594a24805c94"`);
        await queryRunner.query(`ALTER TABLE "conditions" ADD CONSTRAINT "FK_69cd70985a1f2e0594a24805c94" FOREIGN KEY ("condition_group_id") REFERENCES "condition_groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
