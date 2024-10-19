import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeTypeWeek1729298910730 implements MigrationInterface {
    name = 'ChangeTypeWeek1729298910730'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "time_sheets" DROP COLUMN "week"`);
        await queryRunner.query(`ALTER TABLE "time_sheets" ADD "week" character varying(50) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "time_sheets" DROP COLUMN "week"`);
        await queryRunner.query(`ALTER TABLE "time_sheets" ADD "week" date NOT NULL`);
    }

}
