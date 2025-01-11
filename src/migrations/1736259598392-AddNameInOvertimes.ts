import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNameInOvertimes1736259598392 implements MigrationInterface {
    name = 'AddNameInOvertimes1736259598392'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "overtimes" ADD "name" character varying(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "overtimes" DROP COLUMN "name"`);
    }

}
