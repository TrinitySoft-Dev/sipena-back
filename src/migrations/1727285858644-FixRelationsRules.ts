import { MigrationInterface, QueryRunner } from "typeorm";

export class FixRelationsRules1727285858644 implements MigrationInterface {
    name = 'FixRelationsRules1727285858644'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "customers_rules" ("customers_id" integer NOT NULL, "rule_id" integer NOT NULL, CONSTRAINT "PK_59d0909520591e88c1398df1b3b" PRIMARY KEY ("customers_id", "rule_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_29007a15d15073f149fee87f3d" ON "customers_rules" ("customers_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_b07ae4adaea99dbf6200961302" ON "customers_rules" ("rule_id") `);
        await queryRunner.query(`ALTER TABLE "rules" ADD "work_id" integer`);
        await queryRunner.query(`ALTER TABLE "rules" ADD CONSTRAINT "FK_a72bca77095e8b02cee40a1de0c" FOREIGN KEY ("work_id") REFERENCES "works"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customers_rules" ADD CONSTRAINT "FK_29007a15d15073f149fee87f3d5" FOREIGN KEY ("customers_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "customers_rules" ADD CONSTRAINT "FK_b07ae4adaea99dbf62009613024" FOREIGN KEY ("rule_id") REFERENCES "rules"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customers_rules" DROP CONSTRAINT "FK_b07ae4adaea99dbf62009613024"`);
        await queryRunner.query(`ALTER TABLE "customers_rules" DROP CONSTRAINT "FK_29007a15d15073f149fee87f3d5"`);
        await queryRunner.query(`ALTER TABLE "rules" DROP CONSTRAINT "FK_a72bca77095e8b02cee40a1de0c"`);
        await queryRunner.query(`ALTER TABLE "rules" DROP COLUMN "work_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b07ae4adaea99dbf6200961302"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_29007a15d15073f149fee87f3d"`);
        await queryRunner.query(`DROP TABLE "customers_rules"`);
    }

}
