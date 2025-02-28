import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateFiles1731367207390 implements MigrationInterface {
    name = 'UpdateFiles1731367207390'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "container_sizes" RENAME COLUMN "deleted_at" TO "delete_at"`);
        await queryRunner.query(`ALTER TABLE "rules" RENAME COLUMN "deleted_at" TO "delete_at"`);
        await queryRunner.query(`ALTER TABLE "time_sheets" RENAME COLUMN "deleted_at" TO "delete_at"`);
        await queryRunner.query(`ALTER TABLE "info_workers" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "conditions" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "containers" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "works" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "info_workers" ADD "delete_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "conditions" ADD "delete_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "extra_rules" ADD "delete_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "condition_groups" ADD "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::date`);
        await queryRunner.query(`ALTER TABLE "condition_groups" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::date`);
        await queryRunner.query(`ALTER TABLE "condition_groups" ADD "delete_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "timesheet_workers" ADD "delete_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "users" ADD "delete_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "products" ADD "delete_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "containers" ADD "delete_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "works" ADD "delete_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "roles" ADD "delete_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "password_hashes" ADD "delete_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "info_workers" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "info_workers" ADD "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::date`);
        await queryRunner.query(`ALTER TABLE "info_workers" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "info_workers" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::date`);
        await queryRunner.query(`ALTER TABLE "conditions" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "conditions" ADD "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::date`);
        await queryRunner.query(`ALTER TABLE "conditions" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "conditions" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::date`);
        await queryRunner.query(`ALTER TABLE "extra_rules" ALTER COLUMN "created_at" SET DEFAULT ('now'::text)::date`);
        await queryRunner.query(`ALTER TABLE "extra_rules" ALTER COLUMN "updated_at" SET DEFAULT ('now'::text)::date`);
        await queryRunner.query(`ALTER TABLE "container_sizes" ALTER COLUMN "created_at" SET DEFAULT ('now'::text)::date`);
        await queryRunner.query(`ALTER TABLE "container_sizes" ALTER COLUMN "updated_at" SET DEFAULT ('now'::text)::date`);
        await queryRunner.query(`ALTER TABLE "container_sizes" DROP COLUMN "delete_at"`);
        await queryRunner.query(`ALTER TABLE "container_sizes" ADD "delete_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "rules" ALTER COLUMN "created_at" SET DEFAULT ('now'::text)::date`);
        await queryRunner.query(`ALTER TABLE "rules" ALTER COLUMN "updated_at" SET DEFAULT ('now'::text)::date`);
        await queryRunner.query(`ALTER TABLE "rules" DROP COLUMN "delete_at"`);
        await queryRunner.query(`ALTER TABLE "rules" ADD "delete_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "timesheet_workers" ALTER COLUMN "created_at" SET DEFAULT ('now'::text)::date`);
        await queryRunner.query(`ALTER TABLE "timesheet_workers" ALTER COLUMN "updated_at" SET DEFAULT ('now'::text)::date`);
        await queryRunner.query(`COMMENT ON COLUMN "time_sheets"."created_at" IS NULL`);
        await queryRunner.query(`ALTER TABLE "time_sheets" ALTER COLUMN "created_at" SET DEFAULT ('now'::text)::date`);
        await queryRunner.query(`COMMENT ON COLUMN "time_sheets"."updated_at" IS NULL`);
        await queryRunner.query(`ALTER TABLE "time_sheets" ALTER COLUMN "updated_at" SET DEFAULT ('now'::text)::date`);
        await queryRunner.query(`COMMENT ON COLUMN "time_sheets"."delete_at" IS NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::date`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::date`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::date`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::date`);
        await queryRunner.query(`ALTER TABLE "containers" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "containers" ADD "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::date`);
        await queryRunner.query(`ALTER TABLE "containers" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "containers" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::date`);
        await queryRunner.query(`ALTER TABLE "works" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "works" ADD "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::date`);
        await queryRunner.query(`ALTER TABLE "works" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "works" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::date`);
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "roles" ADD "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::date`);
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "roles" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::date`);
        await queryRunner.query(`COMMENT ON COLUMN "password_hashes"."created_at" IS NULL`);
        await queryRunner.query(`ALTER TABLE "password_hashes" ALTER COLUMN "created_at" SET DEFAULT ('now'::text)::date`);
        await queryRunner.query(`COMMENT ON COLUMN "password_hashes"."updated_at" IS NULL`);
        await queryRunner.query(`ALTER TABLE "password_hashes" ALTER COLUMN "updated_at" SET DEFAULT ('now'::text)::date`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "password_hashes" ALTER COLUMN "updated_at" SET DEFAULT now()`);
        await queryRunner.query(`COMMENT ON COLUMN "password_hashes"."updated_at" IS 'Timesheet updated at'`);
        await queryRunner.query(`ALTER TABLE "password_hashes" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`COMMENT ON COLUMN "password_hashes"."created_at" IS 'Timesheet created at'`);
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "roles" ADD "updated_at" date NOT NULL DEFAULT ('now'::text)::date`);
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "roles" ADD "created_at" date NOT NULL DEFAULT ('now'::text)::date`);
        await queryRunner.query(`ALTER TABLE "works" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "works" ADD "updated_at" date NOT NULL DEFAULT ('now'::text)::date`);
        await queryRunner.query(`ALTER TABLE "works" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "works" ADD "created_at" date NOT NULL DEFAULT ('now'::text)::date`);
        await queryRunner.query(`ALTER TABLE "containers" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "containers" ADD "updated_at" date NOT NULL DEFAULT ('now'::text)::date`);
        await queryRunner.query(`ALTER TABLE "containers" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "containers" ADD "created_at" date NOT NULL DEFAULT ('now'::text)::date`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "updated_at" date NOT NULL DEFAULT ('now'::text)::date`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "created_at" date NOT NULL DEFAULT ('now'::text)::date`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "updated_at" date NOT NULL DEFAULT ('now'::text)::date`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "created_at" date NOT NULL DEFAULT ('now'::text)::date`);
        await queryRunner.query(`COMMENT ON COLUMN "time_sheets"."delete_at" IS 'Timesheet deleted at'`);
        await queryRunner.query(`ALTER TABLE "time_sheets" ALTER COLUMN "updated_at" SET DEFAULT now()`);
        await queryRunner.query(`COMMENT ON COLUMN "time_sheets"."updated_at" IS 'Timesheet updated at'`);
        await queryRunner.query(`ALTER TABLE "time_sheets" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`COMMENT ON COLUMN "time_sheets"."created_at" IS 'Timesheet created at'`);
        await queryRunner.query(`ALTER TABLE "timesheet_workers" ALTER COLUMN "updated_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "timesheet_workers" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "rules" DROP COLUMN "delete_at"`);
        await queryRunner.query(`ALTER TABLE "rules" ADD "delete_at" date`);
        await queryRunner.query(`ALTER TABLE "rules" ALTER COLUMN "updated_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "rules" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "container_sizes" DROP COLUMN "delete_at"`);
        await queryRunner.query(`ALTER TABLE "container_sizes" ADD "delete_at" date`);
        await queryRunner.query(`ALTER TABLE "container_sizes" ALTER COLUMN "updated_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "container_sizes" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "extra_rules" ALTER COLUMN "updated_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "extra_rules" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "conditions" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "conditions" ADD "updated_at" date NOT NULL DEFAULT ('now'::text)::date`);
        await queryRunner.query(`ALTER TABLE "conditions" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "conditions" ADD "created_at" date NOT NULL DEFAULT ('now'::text)::date`);
        await queryRunner.query(`ALTER TABLE "info_workers" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "info_workers" ADD "updated_at" date NOT NULL DEFAULT ('now'::text)::date`);
        await queryRunner.query(`ALTER TABLE "info_workers" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "info_workers" ADD "created_at" date NOT NULL DEFAULT ('now'::text)::date`);
        await queryRunner.query(`ALTER TABLE "password_hashes" DROP COLUMN "delete_at"`);
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "delete_at"`);
        await queryRunner.query(`ALTER TABLE "works" DROP COLUMN "delete_at"`);
        await queryRunner.query(`ALTER TABLE "containers" DROP COLUMN "delete_at"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "delete_at"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "delete_at"`);
        await queryRunner.query(`ALTER TABLE "timesheet_workers" DROP COLUMN "delete_at"`);
        await queryRunner.query(`ALTER TABLE "condition_groups" DROP COLUMN "delete_at"`);
        await queryRunner.query(`ALTER TABLE "condition_groups" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "condition_groups" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "extra_rules" DROP COLUMN "delete_at"`);
        await queryRunner.query(`ALTER TABLE "conditions" DROP COLUMN "delete_at"`);
        await queryRunner.query(`ALTER TABLE "info_workers" DROP COLUMN "delete_at"`);
        await queryRunner.query(`ALTER TABLE "works" ADD "deleted_at" date`);
        await queryRunner.query(`ALTER TABLE "containers" ADD "deleted_at" date`);
        await queryRunner.query(`ALTER TABLE "users" ADD "deleted_at" date`);
        await queryRunner.query(`ALTER TABLE "conditions" ADD "deleted_at" date`);
        await queryRunner.query(`ALTER TABLE "info_workers" ADD "deleted_at" date`);
        await queryRunner.query(`ALTER TABLE "time_sheets" RENAME COLUMN "delete_at" TO "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "rules" RENAME COLUMN "delete_at" TO "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "container_sizes" RENAME COLUMN "delete_at" TO "deleted_at"`);
    }

}
