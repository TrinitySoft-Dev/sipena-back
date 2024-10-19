import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeTypesStartAndFinish1729299358618 implements MigrationInterface {
    name = 'ChangeTypesStartAndFinish1729299358618'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "containers" DROP COLUMN "start"`);
        await queryRunner.query(`ALTER TABLE "containers" ADD "start" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "containers" DROP COLUMN "finish"`);
        await queryRunner.query(`ALTER TABLE "containers" ADD "finish" TIMESTAMP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "containers" DROP COLUMN "finish"`);
        await queryRunner.query(`ALTER TABLE "containers" ADD "finish" date NOT NULL`);
        await queryRunner.query(`ALTER TABLE "containers" DROP COLUMN "start"`);
        await queryRunner.query(`ALTER TABLE "containers" ADD "start" date NOT NULL`);
    }

}
