import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveFile1730142275140 implements MigrationInterface {
    name = 'RemoveFile1730142275140'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "extra_rules" DROP COLUMN "unit"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "extra_rules" ADD "unit" character varying(50) NOT NULL`);
    }

}
