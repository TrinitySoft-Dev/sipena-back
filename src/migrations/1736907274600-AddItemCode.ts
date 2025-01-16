import { MigrationInterface, QueryRunner } from "typeorm";

export class AddItemCode1736907274600 implements MigrationInterface {
    name = 'AddItemCode1736907274600'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "time_sheets" ADD "item_code" character varying(100)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "time_sheets" DROP COLUMN "item_code"`);
    }

}
