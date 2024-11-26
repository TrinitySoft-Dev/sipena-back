import { MigrationInterface, QueryRunner } from "typeorm";

export class FixedRelationsWork1732557706788 implements MigrationInterface {
    name = 'FixedRelationsWork1732557706788'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rules_worker" RENAME COLUMN "work" TO "workId"`);
        await queryRunner.query(`ALTER TABLE "rules_worker" DROP COLUMN "workId"`);
        await queryRunner.query(`ALTER TABLE "rules_worker" ADD "workId" integer`);
        await queryRunner.query(`ALTER TABLE "rules_worker" ADD CONSTRAINT "FK_42eda94b067be3cad587428ecc8" FOREIGN KEY ("workId") REFERENCES "works"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rules_worker" DROP CONSTRAINT "FK_42eda94b067be3cad587428ecc8"`);
        await queryRunner.query(`ALTER TABLE "rules_worker" DROP COLUMN "workId"`);
        await queryRunner.query(`ALTER TABLE "rules_worker" ADD "workId" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "rules_worker" RENAME COLUMN "workId" TO "work"`);
    }

}
