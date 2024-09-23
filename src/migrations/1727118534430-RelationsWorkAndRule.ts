import { MigrationInterface, QueryRunner } from "typeorm";

export class RelationsWorkAndRule1727118534430 implements MigrationInterface {
    name = 'RelationsWorkAndRule1727118534430'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rules" ADD "work_id" integer`);
        await queryRunner.query(`ALTER TABLE "rules" ADD CONSTRAINT "FK_a72bca77095e8b02cee40a1de0c" FOREIGN KEY ("work_id") REFERENCES "works"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rules" DROP CONSTRAINT "FK_a72bca77095e8b02cee40a1de0c"`);
        await queryRunner.query(`ALTER TABLE "rules" DROP COLUMN "work_id"`);
    }

}
