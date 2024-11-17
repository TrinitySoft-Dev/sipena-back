import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFieldAvatar1731648080056 implements MigrationInterface {
    name = 'AddFieldAvatar1731648080056'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "avatar" character varying(100)`);
        await queryRunner.query(`COMMENT ON COLUMN "users"."avatar" IS 'User avatar'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "users"."avatar" IS 'User avatar'`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "avatar"`);
    }

}
