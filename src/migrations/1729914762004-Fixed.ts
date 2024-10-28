import { MigrationInterface, QueryRunner } from "typeorm";

export class Fixed1729914762004 implements MigrationInterface {
    name = 'Fixed1729914762004'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customers_extra_rules" DROP CONSTRAINT "FK_bc0947b96b143ef3f491e5fbd18"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bc0947b96b143ef3f491e5fbd1"`);
        await queryRunner.query(`ALTER TABLE "customers_extra_rules" RENAME COLUMN "customers_id" TO "customer_id"`);
        await queryRunner.query(`ALTER TABLE "customers_extra_rules" RENAME CONSTRAINT "PK_b33453ffe592818487b614376b2" TO "PK_cfcfb872739e974e5ca13f1e9ec"`);
        await queryRunner.query(`CREATE INDEX "IDX_b8dd2465dd43deafcc12bf7c65" ON "customers_extra_rules" ("customer_id") `);
        await queryRunner.query(`ALTER TABLE "customers_extra_rules" ADD CONSTRAINT "FK_b8dd2465dd43deafcc12bf7c656" FOREIGN KEY ("customer_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customers_extra_rules" DROP CONSTRAINT "FK_b8dd2465dd43deafcc12bf7c656"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b8dd2465dd43deafcc12bf7c65"`);
        await queryRunner.query(`ALTER TABLE "customers_extra_rules" RENAME CONSTRAINT "PK_cfcfb872739e974e5ca13f1e9ec" TO "PK_b33453ffe592818487b614376b2"`);
        await queryRunner.query(`ALTER TABLE "customers_extra_rules" RENAME COLUMN "customer_id" TO "customers_id"`);
        await queryRunner.query(`CREATE INDEX "IDX_bc0947b96b143ef3f491e5fbd1" ON "customers_extra_rules" ("customers_id") `);
        await queryRunner.query(`ALTER TABLE "customers_extra_rules" ADD CONSTRAINT "FK_bc0947b96b143ef3f491e5fbd18" FOREIGN KEY ("customers_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
