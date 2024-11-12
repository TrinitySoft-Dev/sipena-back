import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPermissions1731366291583 implements MigrationInterface {
    name = 'AddPermissions1731366291583'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "permissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(80) NOT NULL, "created_at" date NOT NULL DEFAULT ('now'::text)::date, "update_at" date NOT NULL DEFAULT ('now'::text)::date, "delete_at" date, CONSTRAINT "UQ_48ce552495d14eae9b187bb6716" UNIQUE ("name"), CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "roles_permissions" ("role_id" uuid NOT NULL, "permission_id" uuid NOT NULL, CONSTRAINT "PK_0cd11f0b35c4d348c6ebb9b36b7" PRIMARY KEY ("role_id", "permission_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_7d2dad9f14eddeb09c256fea71" ON "roles_permissions" ("role_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_337aa8dba227a1fe6b73998307" ON "roles_permissions" ("permission_id") `);
        await queryRunner.query(`ALTER TABLE "roles" DROP CONSTRAINT "PK_c1433d71a4838793a49dcad46ab"`);
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "roles" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "roles" ADD CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "roles_permissions" ADD CONSTRAINT "FK_7d2dad9f14eddeb09c256fea719" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "roles_permissions" ADD CONSTRAINT "FK_337aa8dba227a1fe6b73998307b" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "roles_permissions" DROP CONSTRAINT "FK_337aa8dba227a1fe6b73998307b"`);
        await queryRunner.query(`ALTER TABLE "roles_permissions" DROP CONSTRAINT "FK_7d2dad9f14eddeb09c256fea719"`);
        await queryRunner.query(`ALTER TABLE "roles" DROP CONSTRAINT "PK_c1433d71a4838793a49dcad46ab"`);
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "roles" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "roles" ADD CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id")`);
        await queryRunner.query(`DROP INDEX "public"."IDX_337aa8dba227a1fe6b73998307"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7d2dad9f14eddeb09c256fea71"`);
        await queryRunner.query(`DROP TABLE "roles_permissions"`);
        await queryRunner.query(`DROP TABLE "permissions"`);
    }

}
