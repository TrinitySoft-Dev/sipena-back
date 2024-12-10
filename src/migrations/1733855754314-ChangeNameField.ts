import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeNameField1733855754314 implements MigrationInterface {
    name = 'ChangeNameField1733855754314'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "roles" RENAME COLUMN "active" TO "status"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "roles" RENAME COLUMN "status" TO "active"`);
    }

}
