import { MigrationInterface, QueryRunner } from "typeorm";

export class FixedId1732552969420 implements MigrationInterface {
    name = 'FixedId1732552969420'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rules_worker" DROP CONSTRAINT "PK_dec193ada8811e267985fd670e6"`);
        await queryRunner.query(`ALTER TABLE "rules_worker" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "rules_worker" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "rules_worker" ADD CONSTRAINT "PK_dec193ada8811e267985fd670e6" PRIMARY KEY ("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rules_worker" DROP CONSTRAINT "PK_dec193ada8811e267985fd670e6"`);
        await queryRunner.query(`ALTER TABLE "rules_worker" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "rules_worker" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "rules_worker" ADD CONSTRAINT "PK_dec193ada8811e267985fd670e6" PRIMARY KEY ("id")`);
    }

}
