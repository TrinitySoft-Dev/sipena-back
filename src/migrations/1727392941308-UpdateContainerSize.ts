import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateContainerSize1727392941308 implements MigrationInterface {
    name = 'UpdateContainerSize1727392941308'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rules" RENAME COLUMN "container_size" TO "work_id"`);
        await queryRunner.query(`CREATE TABLE "container_sizes" ("id" SERIAL NOT NULL, "value" integer NOT NULL, "active" boolean NOT NULL DEFAULT false, "created_at" date NOT NULL DEFAULT ('now'::text)::date, "updated_at" date NOT NULL DEFAULT ('now'::text)::date, "deleted_at" date, CONSTRAINT "PK_542d4df3828b46c697b184b4821" PRIMARY KEY ("id")); COMMENT ON COLUMN "container_sizes"."active" IS 'User avatar'`);
        await queryRunner.query(`ALTER TABLE "rules" DROP COLUMN "work_id"`);
        await queryRunner.query(`ALTER TABLE "rules" ADD "work_id" integer`);
        await queryRunner.query(`ALTER TABLE "rules" ADD CONSTRAINT "FK_a72bca77095e8b02cee40a1de0c" FOREIGN KEY ("work_id") REFERENCES "works"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rules" DROP CONSTRAINT "FK_a72bca77095e8b02cee40a1de0c"`);
        await queryRunner.query(`ALTER TABLE "rules" DROP COLUMN "work_id"`);
        await queryRunner.query(`ALTER TABLE "rules" ADD "work_id" numeric NOT NULL`);
        await queryRunner.query(`DROP TABLE "container_sizes"`);
        await queryRunner.query(`ALTER TABLE "rules" RENAME COLUMN "work_id" TO "container_size"`);
    }

}
