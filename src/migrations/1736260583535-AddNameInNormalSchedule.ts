import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNameInNormalSchedule1736260583535 implements MigrationInterface {
    name = 'AddNameInNormalSchedule1736260583535'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "normal_schedule" ADD "name" character varying(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "normal_schedule" DROP COLUMN "name"`);
    }

}
