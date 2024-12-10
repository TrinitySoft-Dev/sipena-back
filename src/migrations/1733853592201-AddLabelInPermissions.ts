import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLabelInPermissions1733853592201 implements MigrationInterface {
    name = 'AddLabelInPermissions1733853592201'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "group_permissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(80) NOT NULL, "created_at" date NOT NULL DEFAULT now(), "update_at" date NOT NULL DEFAULT now(), "delete_at" date, CONSTRAINT "UQ_3dd23f82776524b3ce2e5b03368" UNIQUE ("name"), CONSTRAINT "PK_2eb53190d645a321bc8cad558ac" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "permissions" ADD "label" character varying(80) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "permissions" ADD "groupPermissionsId" uuid`);
        await queryRunner.query(`ALTER TABLE "permissions" ADD CONSTRAINT "FK_ca150f84b5d038bc87143a96922" FOREIGN KEY ("groupPermissionsId") REFERENCES "group_permissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "permissions" DROP CONSTRAINT "FK_ca150f84b5d038bc87143a96922"`);
        await queryRunner.query(`ALTER TABLE "permissions" DROP COLUMN "groupPermissionsId"`);
        await queryRunner.query(`ALTER TABLE "permissions" DROP COLUMN "label"`);
        await queryRunner.query(`DROP TABLE "group_permissions"`);
    }

}
