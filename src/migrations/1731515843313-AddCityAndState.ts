import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCityAndState1731515843313 implements MigrationInterface {
    name = 'AddCityAndState1731515843313'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "state" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(60) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, CONSTRAINT "UQ_b2c4aef5929860729007ac32f6f" UNIQUE ("name"), CONSTRAINT "PK_549ffd046ebab1336c3a8030a12" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b2c4aef5929860729007ac32f6" ON "state" ("name") `);
        await queryRunner.query(`CREATE TABLE "cities" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(60) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, CONSTRAINT "UQ_a0ae8d83b7d32359578c486e7f6" UNIQUE ("name"), CONSTRAINT "PK_4762ffb6e5d198cfec5606bc11e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a0ae8d83b7d32359578c486e7f" ON "cities" ("name") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_a0ae8d83b7d32359578c486e7f"`);
        await queryRunner.query(`DROP TABLE "cities"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b2c4aef5929860729007ac32f6"`);
        await queryRunner.query(`DROP TABLE "state"`);
    }

}
