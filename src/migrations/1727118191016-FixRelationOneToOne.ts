import { MigrationInterface, QueryRunner } from "typeorm";

export class FixRelationOneToOne1727118191016 implements MigrationInterface {
    name = 'FixRelationOneToOne1727118191016'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rules" DROP CONSTRAINT "FK_5281a40fbe6280436468591f4cb"`);
        await queryRunner.query(`ALTER TABLE "rules" DROP COLUMN "workId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rules" ADD "workId" integer`);
        await queryRunner.query(`ALTER TABLE "rules" ADD CONSTRAINT "FK_5281a40fbe6280436468591f4cb" FOREIGN KEY ("workId") REFERENCES "works"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
