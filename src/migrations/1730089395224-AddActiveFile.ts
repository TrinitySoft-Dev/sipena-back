import { MigrationInterface, QueryRunner } from "typeorm";

export class AddActiveFile1730089395224 implements MigrationInterface {
    name = 'AddActiveFile1730089395224'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "extra_rules" ADD "active" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`COMMENT ON COLUMN "extra_rules"."active" IS 'Indicates if the rule is active'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "extra_rules"."active" IS 'Indicates if the rule is active'`);
        await queryRunner.query(`ALTER TABLE "extra_rules" DROP COLUMN "active"`);
    }

}
