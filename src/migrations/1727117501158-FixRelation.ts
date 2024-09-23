import { MigrationInterface, QueryRunner } from "typeorm";

export class FixRelation1727117501158 implements MigrationInterface {
    name = 'FixRelation1727117501158'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rules" ADD "workId" integer`);
        await queryRunner.query(`ALTER TABLE "rules" ADD CONSTRAINT "FK_5281a40fbe6280436468591f4cb" FOREIGN KEY ("workId") REFERENCES "works"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rules" DROP CONSTRAINT "FK_5281a40fbe6280436468591f4cb"`);
        await queryRunner.query(`ALTER TABLE "rules" DROP COLUMN "workId"`);
    }

}
