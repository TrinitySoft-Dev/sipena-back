import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDabase1729880754479 implements MigrationInterface {
    name = 'InitDabase1729880754479'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "info_workers" ("id" SERIAL NOT NULL, "phone" character varying(30) NOT NULL, "tfn" character varying(9) NOT NULL, "abn" character varying(11) NOT NULL, "birthday" date NOT NULL, "employment_end_date" date NOT NULL, "passport_url" character varying(128) NOT NULL, "address" character varying(100) NOT NULL, "city" character varying(100) NOT NULL, "bank_name" character varying(40) NOT NULL, "bank_account_name" character varying(80) NOT NULL, "bank_account_number" character varying(12) NOT NULL, "bsb" character varying(80) NOT NULL, "visa_url" character varying(128) NOT NULL, "active" boolean NOT NULL DEFAULT true, "created_at" date NOT NULL DEFAULT ('now'::text)::date, "updated_at" date NOT NULL DEFAULT ('now'::text)::date, "deleted_at" date, CONSTRAINT "PK_42ddf4819ebf84232c4ae2d382e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "conditions" ("id" SERIAL NOT NULL, "field" character varying(50) NOT NULL, "operator" character varying(20) NOT NULL, "value" character varying(50) NOT NULL, "created_at" date NOT NULL DEFAULT ('now'::text)::date, "updated_at" date NOT NULL DEFAULT ('now'::text)::date, "deleted_at" date, "condition_group_id" integer, CONSTRAINT "PK_3938bdf2933c08ac7af7e0e15e7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "extra_rules" ("id" SERIAL NOT NULL, "name" character varying(60) NOT NULL, "rate" numeric NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f1e1118cf2e7f3f65105b820223" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "condition_groups" ("id" SERIAL NOT NULL, "rule_id" integer, "extraRuleId" integer, CONSTRAINT "PK_c8d5c2245a91d66fd1f22b57a2d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "container_sizes" ("id" SERIAL NOT NULL, "value" character varying NOT NULL, "active" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" date, CONSTRAINT "PK_542d4df3828b46c697b184b4821" PRIMARY KEY ("id")); COMMENT ON COLUMN "container_sizes"."active" IS 'User avatar'`);
        await queryRunner.query(`CREATE TABLE "rules" ("id" SERIAL NOT NULL, "name" character varying(80) NOT NULL, "status" boolean NOT NULL DEFAULT false, "rate" numeric NOT NULL, "active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" date, "containerSizeId" integer, "workId" integer, CONSTRAINT "PK_10fef696a7d61140361b1b23608" PRIMARY KEY ("id")); COMMENT ON COLUMN "rules"."rate" IS 'Rate of the container'`);
        await queryRunner.query(`CREATE TABLE "timesheet_workers" ("id" SERIAL NOT NULL, "break" TIMESTAMP NOT NULL, "waiting_time" TIMESTAMP NOT NULL, "time" TIMESTAMP NOT NULL, "time_out" TIMESTAMP, "comment" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "workerId" integer, "timesheetId" integer, CONSTRAINT "PK_61fb9ad2df76d4bd62f48bb3ba8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "time_sheets" ("id" SERIAL NOT NULL, "day" date NOT NULL, "week" character varying(50) NOT NULL, "images" character varying array NOT NULL, "rate" numeric NOT NULL, "active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "customerId" integer, "containerId" integer, CONSTRAINT "REL_7364ecf0f640469429efb1ffa5" UNIQUE ("containerId"), CONSTRAINT "PK_bcab34f5b9722b1fd4d077b7298" PRIMARY KEY ("id")); COMMENT ON COLUMN "time_sheets"."rate" IS 'Rate of the timesheet'; COMMENT ON COLUMN "time_sheets"."created_at" IS 'Timesheet created at'; COMMENT ON COLUMN "time_sheets"."updated_at" IS 'Timesheet updated at'; COMMENT ON COLUMN "time_sheets"."deleted_at" IS 'Timesheet deleted at'`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "name" character varying, "last_name" character varying, "role" character varying(50) NOT NULL DEFAULT 'WORKER', "completed" boolean NOT NULL DEFAULT false, "active" boolean NOT NULL DEFAULT false, "created_at" date NOT NULL DEFAULT ('now'::text)::date, "updated_at" date NOT NULL DEFAULT ('now'::text)::date, "deleted_at" date, "infoworkerId" integer, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "REL_4d9f172d59c9680ffae95851a2" UNIQUE ("infoworkerId"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")); COMMENT ON COLUMN "users"."email" IS 'User email'; COMMENT ON COLUMN "users"."password" IS 'User password'; COMMENT ON COLUMN "users"."name" IS 'User name'; COMMENT ON COLUMN "users"."last_name" IS 'User lastname'; COMMENT ON COLUMN "users"."role" IS 'User role'; COMMENT ON COLUMN "users"."completed" IS 'Field to check if the user has completed the registration'; COMMENT ON COLUMN "users"."active" IS 'User avatar'`);
        await queryRunner.query(`CREATE TABLE "products" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "price" numeric NOT NULL, "item_code" character varying(255), "active" boolean NOT NULL DEFAULT true, "created_at" date NOT NULL DEFAULT ('now'::text)::date, "updated_at" date NOT NULL DEFAULT ('now'::text)::date, CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "containers" ("id" SERIAL NOT NULL, "container_number" character varying(40) NOT NULL, "size" integer NOT NULL, "skus" integer NOT NULL, "cartons" integer NOT NULL, "pallets" integer NOT NULL DEFAULT '0', "weight" integer NOT NULL, "forklift_driver" boolean NOT NULL DEFAULT false, "trash" boolean NOT NULL DEFAULT false, "mixed" boolean NOT NULL DEFAULT false, "start" TIMESTAMP NOT NULL, "finish" TIMESTAMP NOT NULL, "total_time" character varying(40) NOT NULL, "plt_time_min" character varying(40) NOT NULL, "active" boolean NOT NULL DEFAULT true, "created_at" date NOT NULL DEFAULT ('now'::text)::date, "updated_at" date NOT NULL DEFAULT ('now'::text)::date, "deleted_at" date, "workId" integer, "productId" integer, CONSTRAINT "PK_21cbac3e68f7b1cf53d39cda70c" PRIMARY KEY ("id")); COMMENT ON COLUMN "containers"."container_number" IS 'Container number'`);
        await queryRunner.query(`CREATE TABLE "works" ("id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, "code" character varying(50) NOT NULL, "active" boolean NOT NULL DEFAULT false, "created_at" date NOT NULL DEFAULT ('now'::text)::date, "updated_at" date NOT NULL DEFAULT ('now'::text)::date, "deleted_at" date, CONSTRAINT "PK_a9ffbf516ba6e52604b29e5cce0" PRIMARY KEY ("id")); COMMENT ON COLUMN "works"."active" IS 'User avatar'`);
        await queryRunner.query(`CREATE TABLE "password_hashes" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "token" character varying(64) NOT NULL, "expires" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_924fc6159ab0a0f0e2ffc8efb62" UNIQUE ("token"), CONSTRAINT "PK_ec3c5d7e6d708b6d7864638b3fa" PRIMARY KEY ("id")); COMMENT ON COLUMN "password_hashes"."created_at" IS 'Timesheet created at'; COMMENT ON COLUMN "password_hashes"."updated_at" IS 'Timesheet updated at'`);
        await queryRunner.query(`CREATE INDEX "IDX_924fc6159ab0a0f0e2ffc8efb6" ON "password_hashes" ("token") `);
        await queryRunner.query(`CREATE TABLE "roles" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying(255), "active" boolean NOT NULL DEFAULT true, "created_at" date NOT NULL DEFAULT ('now'::text)::date, "updated_at" date NOT NULL DEFAULT ('now'::text)::date, CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "customers_rules" ("customer_id" integer NOT NULL, "rule_id" integer NOT NULL, CONSTRAINT "PK_7874bb10a35fb599947f9e8be65" PRIMARY KEY ("customer_id", "rule_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_69009658e94ce3bd03e8ce409a" ON "customers_rules" ("customer_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_b07ae4adaea99dbf6200961302" ON "customers_rules" ("rule_id") `);
        await queryRunner.query(`CREATE TABLE "customers_extra_rules" ("customers_id" integer NOT NULL, "extra_rule_id" integer NOT NULL, CONSTRAINT "PK_b33453ffe592818487b614376b2" PRIMARY KEY ("customers_id", "extra_rule_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_bc0947b96b143ef3f491e5fbd1" ON "customers_extra_rules" ("customers_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_4c85469e898ae800f1e82d2915" ON "customers_extra_rules" ("extra_rule_id") `);
        await queryRunner.query(`CREATE TABLE "users_products_products" ("usersId" integer NOT NULL, "productsId" integer NOT NULL, CONSTRAINT "PK_2afd1e49d5e0313b15aee86424f" PRIMARY KEY ("usersId", "productsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_aca61847cb6726b22e1fd4020b" ON "users_products_products" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_f3f6ee991534b7dfa039912c3f" ON "users_products_products" ("productsId") `);
        await queryRunner.query(`ALTER TABLE "conditions" ADD CONSTRAINT "FK_69cd70985a1f2e0594a24805c94" FOREIGN KEY ("condition_group_id") REFERENCES "condition_groups"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "condition_groups" ADD CONSTRAINT "FK_34bf909ffe76cfaa15009546292" FOREIGN KEY ("rule_id") REFERENCES "rules"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "condition_groups" ADD CONSTRAINT "FK_30e1bc3a4f935d17e03a8d95e92" FOREIGN KEY ("extraRuleId") REFERENCES "extra_rules"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rules" ADD CONSTRAINT "FK_747b455dc949f34f093eb875c6e" FOREIGN KEY ("containerSizeId") REFERENCES "container_sizes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rules" ADD CONSTRAINT "FK_5281a40fbe6280436468591f4cb" FOREIGN KEY ("workId") REFERENCES "works"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "timesheet_workers" ADD CONSTRAINT "FK_c806e7cacb813a7e71ce002047c" FOREIGN KEY ("workerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "timesheet_workers" ADD CONSTRAINT "FK_553ac225bc7060e454bf531c6b1" FOREIGN KEY ("timesheetId") REFERENCES "time_sheets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "time_sheets" ADD CONSTRAINT "FK_c7bedf81cfb474989eab165132f" FOREIGN KEY ("customerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "time_sheets" ADD CONSTRAINT "FK_7364ecf0f640469429efb1ffa5a" FOREIGN KEY ("containerId") REFERENCES "containers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_4d9f172d59c9680ffae95851a29" FOREIGN KEY ("infoworkerId") REFERENCES "info_workers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "containers" ADD CONSTRAINT "FK_087d563102c6c3d76dfabe52b77" FOREIGN KEY ("workId") REFERENCES "works"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "containers" ADD CONSTRAINT "FK_d00fe196d263909603476d9dd34" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "password_hashes" ADD CONSTRAINT "FK_71aea4e4a394ab2106bab504f7b" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customers_rules" ADD CONSTRAINT "FK_69009658e94ce3bd03e8ce409a9" FOREIGN KEY ("customer_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "customers_rules" ADD CONSTRAINT "FK_b07ae4adaea99dbf62009613024" FOREIGN KEY ("rule_id") REFERENCES "rules"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customers_extra_rules" ADD CONSTRAINT "FK_bc0947b96b143ef3f491e5fbd18" FOREIGN KEY ("customers_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "customers_extra_rules" ADD CONSTRAINT "FK_4c85469e898ae800f1e82d2915f" FOREIGN KEY ("extra_rule_id") REFERENCES "rules"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_products_products" ADD CONSTRAINT "FK_aca61847cb6726b22e1fd4020bc" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users_products_products" ADD CONSTRAINT "FK_f3f6ee991534b7dfa039912c3fd" FOREIGN KEY ("productsId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_products_products" DROP CONSTRAINT "FK_f3f6ee991534b7dfa039912c3fd"`);
        await queryRunner.query(`ALTER TABLE "users_products_products" DROP CONSTRAINT "FK_aca61847cb6726b22e1fd4020bc"`);
        await queryRunner.query(`ALTER TABLE "customers_extra_rules" DROP CONSTRAINT "FK_4c85469e898ae800f1e82d2915f"`);
        await queryRunner.query(`ALTER TABLE "customers_extra_rules" DROP CONSTRAINT "FK_bc0947b96b143ef3f491e5fbd18"`);
        await queryRunner.query(`ALTER TABLE "customers_rules" DROP CONSTRAINT "FK_b07ae4adaea99dbf62009613024"`);
        await queryRunner.query(`ALTER TABLE "customers_rules" DROP CONSTRAINT "FK_69009658e94ce3bd03e8ce409a9"`);
        await queryRunner.query(`ALTER TABLE "password_hashes" DROP CONSTRAINT "FK_71aea4e4a394ab2106bab504f7b"`);
        await queryRunner.query(`ALTER TABLE "containers" DROP CONSTRAINT "FK_d00fe196d263909603476d9dd34"`);
        await queryRunner.query(`ALTER TABLE "containers" DROP CONSTRAINT "FK_087d563102c6c3d76dfabe52b77"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_4d9f172d59c9680ffae95851a29"`);
        await queryRunner.query(`ALTER TABLE "time_sheets" DROP CONSTRAINT "FK_7364ecf0f640469429efb1ffa5a"`);
        await queryRunner.query(`ALTER TABLE "time_sheets" DROP CONSTRAINT "FK_c7bedf81cfb474989eab165132f"`);
        await queryRunner.query(`ALTER TABLE "timesheet_workers" DROP CONSTRAINT "FK_553ac225bc7060e454bf531c6b1"`);
        await queryRunner.query(`ALTER TABLE "timesheet_workers" DROP CONSTRAINT "FK_c806e7cacb813a7e71ce002047c"`);
        await queryRunner.query(`ALTER TABLE "rules" DROP CONSTRAINT "FK_5281a40fbe6280436468591f4cb"`);
        await queryRunner.query(`ALTER TABLE "rules" DROP CONSTRAINT "FK_747b455dc949f34f093eb875c6e"`);
        await queryRunner.query(`ALTER TABLE "condition_groups" DROP CONSTRAINT "FK_30e1bc3a4f935d17e03a8d95e92"`);
        await queryRunner.query(`ALTER TABLE "condition_groups" DROP CONSTRAINT "FK_34bf909ffe76cfaa15009546292"`);
        await queryRunner.query(`ALTER TABLE "conditions" DROP CONSTRAINT "FK_69cd70985a1f2e0594a24805c94"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f3f6ee991534b7dfa039912c3f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_aca61847cb6726b22e1fd4020b"`);
        await queryRunner.query(`DROP TABLE "users_products_products"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4c85469e898ae800f1e82d2915"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bc0947b96b143ef3f491e5fbd1"`);
        await queryRunner.query(`DROP TABLE "customers_extra_rules"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b07ae4adaea99dbf6200961302"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_69009658e94ce3bd03e8ce409a"`);
        await queryRunner.query(`DROP TABLE "customers_rules"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_924fc6159ab0a0f0e2ffc8efb6"`);
        await queryRunner.query(`DROP TABLE "password_hashes"`);
        await queryRunner.query(`DROP TABLE "works"`);
        await queryRunner.query(`DROP TABLE "containers"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "time_sheets"`);
        await queryRunner.query(`DROP TABLE "timesheet_workers"`);
        await queryRunner.query(`DROP TABLE "rules"`);
        await queryRunner.query(`DROP TABLE "container_sizes"`);
        await queryRunner.query(`DROP TABLE "condition_groups"`);
        await queryRunner.query(`DROP TABLE "extra_rules"`);
        await queryRunner.query(`DROP TABLE "conditions"`);
        await queryRunner.query(`DROP TABLE "info_workers"`);
    }

}
