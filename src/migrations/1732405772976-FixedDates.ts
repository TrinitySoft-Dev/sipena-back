import { MigrationInterface, QueryRunner } from "typeorm";

export class FixedDates1732405772976 implements MigrationInterface {
    name = 'FixedDates1732405772976'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "info_workers" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "info_workers" ALTER COLUMN "updated_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "conditions" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "conditions" ALTER COLUMN "updated_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "extra_rules" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "extra_rules" ALTER COLUMN "updated_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "condition_groups" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "condition_groups" ALTER COLUMN "updated_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "container_sizes" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "container_sizes" ALTER COLUMN "updated_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "rules" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "rules" ALTER COLUMN "updated_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "works" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "works" ALTER COLUMN "updated_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "containers" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "containers" ALTER COLUMN "updated_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "updated_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "timesheet_workers" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "timesheet_workers" ALTER COLUMN "updated_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "time_sheets" ALTER COLUMN "base" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "time_sheets" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "time_sheets" ALTER COLUMN "updated_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "updated_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "permissions" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "permissions" ALTER COLUMN "update_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "roles" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "roles" ALTER COLUMN "updated_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "password_hashes" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "password_hashes" ALTER COLUMN "updated_at" SET DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "password_hashes" ALTER COLUMN "updated_at" SET DEFAULT ('now'::text)::date`);
        await queryRunner.query(`ALTER TABLE "password_hashes" ALTER COLUMN "created_at" SET DEFAULT ('now'::text)::date`);
        await queryRunner.query(`ALTER TABLE "roles" ALTER COLUMN "updated_at" SET DEFAULT ('now'::text)::date`);
        await queryRunner.query(`ALTER TABLE "roles" ALTER COLUMN "created_at" SET DEFAULT ('now'::text)::date`);
        await queryRunner.query(`ALTER TABLE "permissions" ALTER COLUMN "update_at" SET DEFAULT ('now'::text)::date`);
        await queryRunner.query(`ALTER TABLE "permissions" ALTER COLUMN "created_at" SET DEFAULT ('now'::text)::date`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "updated_at" SET DEFAULT ('now'::text)::date`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT ('now'::text)::date`);
        await queryRunner.query(`ALTER TABLE "time_sheets" ALTER COLUMN "updated_at" SET DEFAULT ('now'::text)::date`);
        await queryRunner.query(`ALTER TABLE "time_sheets" ALTER COLUMN "created_at" SET DEFAULT ('now'::text)::date`);
        await queryRunner.query(`ALTER TABLE "time_sheets" ALTER COLUMN "base" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "timesheet_workers" ALTER COLUMN "updated_at" SET DEFAULT ('now'::text)::date`);
        await queryRunner.query(`ALTER TABLE "timesheet_workers" ALTER COLUMN "created_at" SET DEFAULT ('now'::text)::date`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "updated_at" SET DEFAULT ('now'::text)::date`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "created_at" SET DEFAULT ('now'::text)::date`);
        await queryRunner.query(`ALTER TABLE "containers" ALTER COLUMN "updated_at" SET DEFAULT ('now'::text)::date`);
        await queryRunner.query(`ALTER TABLE "containers" ALTER COLUMN "created_at" SET DEFAULT ('now'::text)::date`);
        await queryRunner.query(`ALTER TABLE "works" ALTER COLUMN "updated_at" SET DEFAULT ('now'::text)::date`);
        await queryRunner.query(`ALTER TABLE "works" ALTER COLUMN "created_at" SET DEFAULT ('now'::text)::date`);
        await queryRunner.query(`ALTER TABLE "rules" ALTER COLUMN "updated_at" SET DEFAULT ('now'::text)::date`);
        await queryRunner.query(`ALTER TABLE "rules" ALTER COLUMN "created_at" SET DEFAULT ('now'::text)::date`);
        await queryRunner.query(`ALTER TABLE "container_sizes" ALTER COLUMN "updated_at" SET DEFAULT ('now'::text)::date`);
        await queryRunner.query(`ALTER TABLE "container_sizes" ALTER COLUMN "created_at" SET DEFAULT ('now'::text)::date`);
        await queryRunner.query(`ALTER TABLE "condition_groups" ALTER COLUMN "updated_at" SET DEFAULT ('now'::text)::date`);
        await queryRunner.query(`ALTER TABLE "condition_groups" ALTER COLUMN "created_at" SET DEFAULT ('now'::text)::date`);
        await queryRunner.query(`ALTER TABLE "extra_rules" ALTER COLUMN "updated_at" SET DEFAULT ('now'::text)::date`);
        await queryRunner.query(`ALTER TABLE "extra_rules" ALTER COLUMN "created_at" SET DEFAULT ('now'::text)::date`);
        await queryRunner.query(`ALTER TABLE "conditions" ALTER COLUMN "updated_at" SET DEFAULT ('now'::text)::date`);
        await queryRunner.query(`ALTER TABLE "conditions" ALTER COLUMN "created_at" SET DEFAULT ('now'::text)::date`);
        await queryRunner.query(`ALTER TABLE "info_workers" ALTER COLUMN "updated_at" SET DEFAULT ('now'::text)::date`);
        await queryRunner.query(`ALTER TABLE "info_workers" ALTER COLUMN "created_at" SET DEFAULT ('now'::text)::date`);
    }

}
