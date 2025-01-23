import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationCityAndState1737654478437 implements MigrationInterface {
    name = 'MigrationCityAndState1737654478437'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "info_workers" DROP CONSTRAINT "FK_f280be9dbda746058280e6cffad"`);
        await queryRunner.query(`ALTER TABLE "info_workers" DROP CONSTRAINT "FK_26cd73d783a529020c3d5410533"`);
        await queryRunner.query(`ALTER TABLE "info_workers" DROP COLUMN "cityId"`);
        await queryRunner.query(`ALTER TABLE "info_workers" DROP COLUMN "stateId"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "stateId" uuid`);
        await queryRunner.query(`ALTER TABLE "users" ADD "cityId" uuid`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_17bdaad57c3360aae9fb9a1741f" FOREIGN KEY ("stateId") REFERENCES "state"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_3785318df310caf8cb8e1e37d85" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_3785318df310caf8cb8e1e37d85"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_17bdaad57c3360aae9fb9a1741f"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "cityId"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "stateId"`);
        await queryRunner.query(`ALTER TABLE "info_workers" ADD "stateId" uuid`);
        await queryRunner.query(`ALTER TABLE "info_workers" ADD "cityId" uuid`);
        await queryRunner.query(`ALTER TABLE "info_workers" ADD CONSTRAINT "FK_26cd73d783a529020c3d5410533" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "info_workers" ADD CONSTRAINT "FK_f280be9dbda746058280e6cffad" FOREIGN KEY ("stateId") REFERENCES "state"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
