import { MigrationInterface, QueryRunner } from "typeorm";

export class AddJoinColumnToNormalSchedule1735863311514 implements MigrationInterface {
    name = 'AddJoinColumnToNormalSchedule1735863311514'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "normal_schedule" ADD "customerId" integer`);
        await queryRunner.query(`ALTER TABLE "normal_schedule" ADD CONSTRAINT "UQ_d0c6efba0dde51e9f13a40c129f" UNIQUE ("customerId")`);
        await queryRunner.query(`ALTER TABLE "normal_schedule" ADD CONSTRAINT "FK_d0c6efba0dde51e9f13a40c129f" FOREIGN KEY ("customerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "normal_schedule" DROP CONSTRAINT "FK_d0c6efba0dde51e9f13a40c129f"`);
        await queryRunner.query(`ALTER TABLE "normal_schedule" DROP CONSTRAINT "UQ_d0c6efba0dde51e9f13a40c129f"`);
        await queryRunner.query(`ALTER TABLE "normal_schedule" DROP COLUMN "customerId"`);
    }

}
