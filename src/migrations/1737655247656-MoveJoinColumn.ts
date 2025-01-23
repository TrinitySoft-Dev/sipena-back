import { MigrationInterface, QueryRunner } from "typeorm";

export class MoveJoinColumn1737655247656 implements MigrationInterface {
    name = 'MoveJoinColumn1737655247656'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_4d9f172d59c9680ffae95851a29"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "REL_4d9f172d59c9680ffae95851a2"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "infoworkerId"`);
        await queryRunner.query(`ALTER TABLE "info_workers" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "info_workers" ADD CONSTRAINT "UQ_cd401ca7bf7d6ac11e7fd860be3" UNIQUE ("userId")`);
        await queryRunner.query(`ALTER TABLE "info_workers" ADD CONSTRAINT "FK_cd401ca7bf7d6ac11e7fd860be3" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "info_workers" DROP CONSTRAINT "FK_cd401ca7bf7d6ac11e7fd860be3"`);
        await queryRunner.query(`ALTER TABLE "info_workers" DROP CONSTRAINT "UQ_cd401ca7bf7d6ac11e7fd860be3"`);
        await queryRunner.query(`ALTER TABLE "info_workers" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "infoworkerId" integer`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "REL_4d9f172d59c9680ffae95851a2" UNIQUE ("infoworkerId")`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_4d9f172d59c9680ffae95851a29" FOREIGN KEY ("infoworkerId") REFERENCES "info_workers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
