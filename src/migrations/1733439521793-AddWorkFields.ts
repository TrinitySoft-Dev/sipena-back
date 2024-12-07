import { MigrationInterface, QueryRunner } from "typeorm";

export class AddWorkFields1733439521793 implements MigrationInterface {
    name = 'AddWorkFields1733439521793'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "work_fields" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "path" character varying NOT NULL, "isVisible" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "delete_at" TIMESTAMP, "workId" integer, CONSTRAINT "PK_f2de5b6bf0374eb7a43aad09606" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "work_fields" ADD CONSTRAINT "FK_b86e14fd282c0e5bcc55760cbe4" FOREIGN KEY ("workId") REFERENCES "works"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "work_fields" DROP CONSTRAINT "FK_b86e14fd282c0e5bcc55760cbe4"`);
        await queryRunner.query(`DROP TABLE "work_fields"`);
    }

}
