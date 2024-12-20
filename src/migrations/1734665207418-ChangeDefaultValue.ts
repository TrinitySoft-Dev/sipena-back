import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeDefaultValue1734665207418 implements MigrationInterface {
    name = 'ChangeDefaultValue1734665207418'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "active" SET DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "active" SET DEFAULT false`);
    }

}
