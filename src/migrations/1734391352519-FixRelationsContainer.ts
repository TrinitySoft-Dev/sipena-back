import { MigrationInterface, QueryRunner } from "typeorm";

export class FixRelationsContainer1734391352519 implements MigrationInterface {
    name = 'FixRelationsContainer1734391352519'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "containers" RENAME COLUMN "size" TO "sizeId"`);
        await queryRunner.query(`ALTER TABLE "containers" ALTER COLUMN "sizeId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "containers" ADD CONSTRAINT "FK_382b2a1b448040016b66a974e16" FOREIGN KEY ("sizeId") REFERENCES "container_sizes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "containers" DROP CONSTRAINT "FK_382b2a1b448040016b66a974e16"`);
        await queryRunner.query(`ALTER TABLE "containers" ALTER COLUMN "sizeId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "containers" RENAME COLUMN "sizeId" TO "size"`);
    }

}
