import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFilesUser1729524001436 implements MigrationInterface {
    name = 'AddFilesUser1729524001436'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "info_workers" ADD "bank_name" character varying(40) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "info_workers" ADD "bank_account_name" character varying(80) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "info_workers" ADD "bank_account_number" character varying(12) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "info_workers" ADD "bsb" character varying(80) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "info_workers" DROP COLUMN "bsb"`);
        await queryRunner.query(`ALTER TABLE "info_workers" DROP COLUMN "bank_account_number"`);
        await queryRunner.query(`ALTER TABLE "info_workers" DROP COLUMN "bank_account_name"`);
        await queryRunner.query(`ALTER TABLE "info_workers" DROP COLUMN "bank_name"`);
    }

}
