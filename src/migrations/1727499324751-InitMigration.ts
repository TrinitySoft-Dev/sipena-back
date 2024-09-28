import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1727499324751 implements MigrationInterface {
    name = 'InitMigration1727499324751'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "conditions" ("id" SERIAL NOT NULL, "field" character varying(50) NOT NULL, "operator" character varying(20) NOT NULL, "value" character varying(50) NOT NULL, "created_at" date NOT NULL DEFAULT ('now'::text)::date, "updated_at" date NOT NULL DEFAULT ('now'::text)::date, "deleted_at" date, "condition_group_id" integer, CONSTRAINT "PK_3938bdf2933c08ac7af7e0e15e7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "condition_groups" ("id" SERIAL NOT NULL, "rule_id" integer, CONSTRAINT "PK_c8d5c2245a91d66fd1f22b57a2d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "container_sizes" ("id" SERIAL NOT NULL, "value" integer NOT NULL, "active" boolean NOT NULL DEFAULT false, "created_at" date NOT NULL DEFAULT ('now'::text)::date, "updated_at" date NOT NULL DEFAULT ('now'::text)::date, "deleted_at" date, CONSTRAINT "PK_542d4df3828b46c697b184b4821" PRIMARY KEY ("id")); COMMENT ON COLUMN "container_sizes"."active" IS 'User avatar'`);
        await queryRunner.query(`CREATE TABLE "info_workers" ("id" SERIAL NOT NULL, "phone" character varying(30) NOT NULL, "tfn" character varying(9) NOT NULL, "abn" character varying(11) NOT NULL, "birthday" date NOT NULL, "employment_end_date" date NOT NULL, "passport_url" character varying(128) NOT NULL, "address" character varying(100) NOT NULL, "city" character varying(100) NOT NULL, "visa_url" character varying(128) NOT NULL, "active" boolean NOT NULL DEFAULT true, "created_at" date NOT NULL DEFAULT ('now'::text)::date, "updated_at" date NOT NULL DEFAULT ('now'::text)::date, "deleted_at" date, CONSTRAINT "PK_42ddf4819ebf84232c4ae2d382e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "products" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "price" numeric NOT NULL, "item_code" character varying(255) NOT NULL, "active" boolean NOT NULL DEFAULT true, "created_at" date NOT NULL DEFAULT ('now'::text)::date, "updated_at" date NOT NULL DEFAULT ('now'::text)::date, CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "containers" ("id" SERIAL NOT NULL, "container_number" character varying(40) NOT NULL, "work" character varying(40) NOT NULL, "size" integer NOT NULL, "product" character varying(40) NOT NULL, "skus" integer NOT NULL, "cartons" integer NOT NULL, "pallets" integer NOT NULL DEFAULT '0', "weight" integer NOT NULL, "forklift_driver" boolean NOT NULL DEFAULT false, "trash" boolean NOT NULL DEFAULT false, "mixed" boolean NOT NULL DEFAULT false, "start" date NOT NULL, "finish" date NOT NULL, "total_time" character varying(40) NOT NULL, "plt_time_min" character varying(40) NOT NULL, "active" boolean NOT NULL DEFAULT true, "created_at" date NOT NULL DEFAULT ('now'::text)::date, "updated_at" date NOT NULL DEFAULT ('now'::text)::date, "deleted_at" date, CONSTRAINT "PK_21cbac3e68f7b1cf53d39cda70c" PRIMARY KEY ("id")); COMMENT ON COLUMN "containers"."container_number" IS 'Container number'`);
        await queryRunner.query(`CREATE TABLE "time_sheets" ("id" SERIAL NOT NULL, "day" date NOT NULL, "week" date NOT NULL, "images" character varying array NOT NULL, "rate" numeric NOT NULL, "comments" character varying(255), "active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "customerId" integer, "containerId" integer, CONSTRAINT "REL_7364ecf0f640469429efb1ffa5" UNIQUE ("containerId"), CONSTRAINT "PK_bcab34f5b9722b1fd4d077b7298" PRIMARY KEY ("id")); COMMENT ON COLUMN "time_sheets"."rate" IS 'Rate of the timesheet'; COMMENT ON COLUMN "time_sheets"."comments" IS 'Comments of the timesheet'; COMMENT ON COLUMN "time_sheets"."created_at" IS 'Timesheet created at'; COMMENT ON COLUMN "time_sheets"."updated_at" IS 'Timesheet updated at'; COMMENT ON COLUMN "time_sheets"."deleted_at" IS 'Timesheet deleted at'`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "name" character varying, "last_name" character varying, "role" character varying(50) NOT NULL DEFAULT 'WORKER', "active" boolean NOT NULL DEFAULT false, "created_at" date NOT NULL DEFAULT ('now'::text)::date, "updated_at" date NOT NULL DEFAULT ('now'::text)::date, "deleted_at" date, "infoworkerId" integer, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "REL_4d9f172d59c9680ffae95851a2" UNIQUE ("infoworkerId"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")); COMMENT ON COLUMN "users"."email" IS 'User email'; COMMENT ON COLUMN "users"."password" IS 'User password'; COMMENT ON COLUMN "users"."name" IS 'User name'; COMMENT ON COLUMN "users"."last_name" IS 'User lastname'; COMMENT ON COLUMN "users"."role" IS 'User role'; COMMENT ON COLUMN "users"."active" IS 'User avatar'`);
        await queryRunner.query(`CREATE TABLE "rules" ("id" SERIAL NOT NULL, "status" boolean NOT NULL DEFAULT false, "rate" numeric NOT NULL, "active" boolean NOT NULL DEFAULT true, "created_at" date NOT NULL DEFAULT ('now'::text)::date, "updated_at" date NOT NULL DEFAULT ('now'::text)::date, "deleted_at" date, "work_id" integer, CONSTRAINT "PK_10fef696a7d61140361b1b23608" PRIMARY KEY ("id")); COMMENT ON COLUMN "rules"."rate" IS 'Rate of the container'`);
        await queryRunner.query(`CREATE TABLE "works" ("id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, "code" character varying(50) NOT NULL, "active" boolean NOT NULL DEFAULT false, "created_at" date NOT NULL DEFAULT ('now'::text)::date, "updated_at" date NOT NULL DEFAULT ('now'::text)::date, "deleted_at" date, CONSTRAINT "PK_a9ffbf516ba6e52604b29e5cce0" PRIMARY KEY ("id")); COMMENT ON COLUMN "works"."active" IS 'User avatar'`);
        await queryRunner.query(`CREATE TABLE "roles" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying(255), "active" boolean NOT NULL DEFAULT true, "created_at" date NOT NULL DEFAULT ('now'::text)::date, "updated_at" date NOT NULL DEFAULT ('now'::text)::date, CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "timesheet_workers" ("timesheet_id" integer NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "PK_c1e3ec6d609dba6e4e816c5e66d" PRIMARY KEY ("timesheet_id", "user_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ee8155e0c387eae85fc1ae422c" ON "timesheet_workers" ("timesheet_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_3c3f061bcf28a1dbaeb24d73e9" ON "timesheet_workers" ("user_id") `);
        await queryRunner.query(`CREATE TABLE "customers_rules" ("customers_id" integer NOT NULL, "rule_id" integer NOT NULL, CONSTRAINT "PK_59d0909520591e88c1398df1b3b" PRIMARY KEY ("customers_id", "rule_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_29007a15d15073f149fee87f3d" ON "customers_rules" ("customers_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_b07ae4adaea99dbf6200961302" ON "customers_rules" ("rule_id") `);
        await queryRunner.query(`CREATE TABLE "user_products" ("user_id" integer NOT NULL, "product_id" integer NOT NULL, CONSTRAINT "PK_b9470e455b81e2f0bc0d32f269f" PRIMARY KEY ("user_id", "product_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_494f0246efbe65076d1051c653" ON "user_products" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_1c5a5dc69b4ac2b5ee47568477" ON "user_products" ("product_id") `);
        await queryRunner.query(`ALTER TABLE "conditions" ADD CONSTRAINT "FK_69cd70985a1f2e0594a24805c94" FOREIGN KEY ("condition_group_id") REFERENCES "condition_groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "condition_groups" ADD CONSTRAINT "FK_34bf909ffe76cfaa15009546292" FOREIGN KEY ("rule_id") REFERENCES "rules"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "time_sheets" ADD CONSTRAINT "FK_c7bedf81cfb474989eab165132f" FOREIGN KEY ("customerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "time_sheets" ADD CONSTRAINT "FK_7364ecf0f640469429efb1ffa5a" FOREIGN KEY ("containerId") REFERENCES "containers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_4d9f172d59c9680ffae95851a29" FOREIGN KEY ("infoworkerId") REFERENCES "info_workers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rules" ADD CONSTRAINT "FK_a72bca77095e8b02cee40a1de0c" FOREIGN KEY ("work_id") REFERENCES "works"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "timesheet_workers" ADD CONSTRAINT "FK_ee8155e0c387eae85fc1ae422cb" FOREIGN KEY ("timesheet_id") REFERENCES "time_sheets"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "timesheet_workers" ADD CONSTRAINT "FK_3c3f061bcf28a1dbaeb24d73e91" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customers_rules" ADD CONSTRAINT "FK_29007a15d15073f149fee87f3d5" FOREIGN KEY ("customers_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "customers_rules" ADD CONSTRAINT "FK_b07ae4adaea99dbf62009613024" FOREIGN KEY ("rule_id") REFERENCES "rules"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_products" ADD CONSTRAINT "FK_494f0246efbe65076d1051c6539" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_products" ADD CONSTRAINT "FK_1c5a5dc69b4ac2b5ee475684779" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_products" DROP CONSTRAINT "FK_1c5a5dc69b4ac2b5ee475684779"`);
        await queryRunner.query(`ALTER TABLE "user_products" DROP CONSTRAINT "FK_494f0246efbe65076d1051c6539"`);
        await queryRunner.query(`ALTER TABLE "customers_rules" DROP CONSTRAINT "FK_b07ae4adaea99dbf62009613024"`);
        await queryRunner.query(`ALTER TABLE "customers_rules" DROP CONSTRAINT "FK_29007a15d15073f149fee87f3d5"`);
        await queryRunner.query(`ALTER TABLE "timesheet_workers" DROP CONSTRAINT "FK_3c3f061bcf28a1dbaeb24d73e91"`);
        await queryRunner.query(`ALTER TABLE "timesheet_workers" DROP CONSTRAINT "FK_ee8155e0c387eae85fc1ae422cb"`);
        await queryRunner.query(`ALTER TABLE "rules" DROP CONSTRAINT "FK_a72bca77095e8b02cee40a1de0c"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_4d9f172d59c9680ffae95851a29"`);
        await queryRunner.query(`ALTER TABLE "time_sheets" DROP CONSTRAINT "FK_7364ecf0f640469429efb1ffa5a"`);
        await queryRunner.query(`ALTER TABLE "time_sheets" DROP CONSTRAINT "FK_c7bedf81cfb474989eab165132f"`);
        await queryRunner.query(`ALTER TABLE "condition_groups" DROP CONSTRAINT "FK_34bf909ffe76cfaa15009546292"`);
        await queryRunner.query(`ALTER TABLE "conditions" DROP CONSTRAINT "FK_69cd70985a1f2e0594a24805c94"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1c5a5dc69b4ac2b5ee47568477"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_494f0246efbe65076d1051c653"`);
        await queryRunner.query(`DROP TABLE "user_products"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b07ae4adaea99dbf6200961302"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_29007a15d15073f149fee87f3d"`);
        await queryRunner.query(`DROP TABLE "customers_rules"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3c3f061bcf28a1dbaeb24d73e9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ee8155e0c387eae85fc1ae422c"`);
        await queryRunner.query(`DROP TABLE "timesheet_workers"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP TABLE "works"`);
        await queryRunner.query(`DROP TABLE "rules"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "time_sheets"`);
        await queryRunner.query(`DROP TABLE "containers"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TABLE "info_workers"`);
        await queryRunner.query(`DROP TABLE "container_sizes"`);
        await queryRunner.query(`DROP TABLE "condition_groups"`);
        await queryRunner.query(`DROP TABLE "conditions"`);
    }

}
