import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveFiles1730139585017 implements MigrationInterface {
    name = 'RemoveFiles1730139585017'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "extra_rules" DROP COLUMN "limit"`);
        await queryRunner.query(`ALTER TABLE "extra_rules" DROP COLUMN "unit"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "extra_rules" ADD "unit" character varying(20) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "extra_rules" ADD "limit" integer`);
    }

}
