import { MigrationInterface, QueryRunner } from "typeorm";

export class FixedRelations1733440303896 implements MigrationInterface {
    name = 'FixedRelations1733440303896'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "work_fields" DROP CONSTRAINT "FK_b86e14fd282c0e5bcc55760cbe4"`);
        await queryRunner.query(`CREATE TABLE "work_field_visibilities" ("id" SERIAL NOT NULL, "isVisible" boolean NOT NULL DEFAULT true, "workId" integer, "fieldId" integer, CONSTRAINT "PK_9694fa448323a569049e8f48548" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "work_fields" DROP COLUMN "workId"`);
        await queryRunner.query(`ALTER TABLE "work_fields" DROP COLUMN "isVisible"`);
        await queryRunner.query(`ALTER TABLE "condition_groups" ADD "ruleWorkersId" integer`);
        await queryRunner.query(`ALTER TABLE "condition_groups" ADD CONSTRAINT "FK_e4db09974b4e6de7b6ba4bcfd39" FOREIGN KEY ("ruleWorkersId") REFERENCES "rules_worker"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "work_field_visibilities" ADD CONSTRAINT "FK_6ff8af5feb1098d8098a65b9e33" FOREIGN KEY ("workId") REFERENCES "works"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "work_field_visibilities" ADD CONSTRAINT "FK_6e2f72bada34f9003aea2112f00" FOREIGN KEY ("fieldId") REFERENCES "work_fields"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "work_field_visibilities" DROP CONSTRAINT "FK_6e2f72bada34f9003aea2112f00"`);
        await queryRunner.query(`ALTER TABLE "work_field_visibilities" DROP CONSTRAINT "FK_6ff8af5feb1098d8098a65b9e33"`);
        await queryRunner.query(`ALTER TABLE "condition_groups" DROP CONSTRAINT "FK_e4db09974b4e6de7b6ba4bcfd39"`);
        await queryRunner.query(`ALTER TABLE "condition_groups" DROP COLUMN "ruleWorkersId"`);
        await queryRunner.query(`ALTER TABLE "work_fields" ADD "isVisible" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "work_fields" ADD "workId" integer`);
        await queryRunner.query(`DROP TABLE "work_field_visibilities"`);
        await queryRunner.query(`ALTER TABLE "work_fields" ADD CONSTRAINT "FK_b86e14fd282c0e5bcc55760cbe4" FOREIGN KEY ("workId") REFERENCES "works"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
