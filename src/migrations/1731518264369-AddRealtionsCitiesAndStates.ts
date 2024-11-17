import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRealtionsCitiesAndStates1731518264369 implements MigrationInterface {
    name = 'AddRealtionsCitiesAndStates1731518264369'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cities" ADD "stateId" uuid`);
        await queryRunner.query(`ALTER TABLE "cities" ADD CONSTRAINT "FK_ded8a17cd090922d5bac8a2361f" FOREIGN KEY ("stateId") REFERENCES "state"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cities" DROP CONSTRAINT "FK_ded8a17cd090922d5bac8a2361f"`);
        await queryRunner.query(`ALTER TABLE "cities" DROP COLUMN "stateId"`);
    }

}
