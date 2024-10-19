import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateRelationsWorkAndContainer1729315201136 implements MigrationInterface {
    name = 'UpdateRelationsWorkAndContainer1729315201136'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "containers" RENAME COLUMN "work" TO "workId"`);
        await queryRunner.query(`ALTER TABLE "containers" DROP COLUMN "workId"`);
        await queryRunner.query(`ALTER TABLE "containers" ADD "workId" integer`);
        await queryRunner.query(`ALTER TABLE "containers" ADD CONSTRAINT "FK_087d563102c6c3d76dfabe52b77" FOREIGN KEY ("workId") REFERENCES "works"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "containers" DROP CONSTRAINT "FK_087d563102c6c3d76dfabe52b77"`);
        await queryRunner.query(`ALTER TABLE "containers" DROP COLUMN "workId"`);
        await queryRunner.query(`ALTER TABLE "containers" ADD "workId" character varying(40) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "containers" RENAME COLUMN "workId" TO "work"`);
    }

}
