import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateInfoWorker1731540463699 implements MigrationInterface {
    name = 'UpdateInfoWorker1731540463699'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "info_workers" RENAME COLUMN "city" TO "cityId"`);
        await queryRunner.query(`ALTER TABLE "info_workers" DROP COLUMN "cityId"`);
        await queryRunner.query(`ALTER TABLE "info_workers" ADD "cityId" uuid`);
        await queryRunner.query(`ALTER TABLE "info_workers" ADD CONSTRAINT "FK_26cd73d783a529020c3d5410533" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "info_workers" DROP CONSTRAINT "FK_26cd73d783a529020c3d5410533"`);
        await queryRunner.query(`ALTER TABLE "info_workers" DROP COLUMN "cityId"`);
        await queryRunner.query(`ALTER TABLE "info_workers" ADD "cityId" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "info_workers" RENAME COLUMN "cityId" TO "city"`);
    }

}
