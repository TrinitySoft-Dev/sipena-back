import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddStateInInfoworker1731550237453 implements MigrationInterface {
  name = 'AddStateInInfoworker1731550237453'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "info_workers" ADD "postal_code" character varying(20)`)
    await queryRunner.query(`UPDATE "info_workers" SET "postal_code" = '00000' WHERE "postal_code" IS NULL`)
    await queryRunner.query(`ALTER TABLE "info_workers" ALTER COLUMN "postal_code" SET NOT NULL`)
    await queryRunner.query(`ALTER TABLE "info_workers" ADD "stateId" uuid`)
    await queryRunner.query(
      `ALTER TABLE "info_workers" ADD CONSTRAINT "FK_f280be9dbda746058280e6cffad" FOREIGN KEY ("stateId") REFERENCES "state"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "info_workers" DROP CONSTRAINT "FK_f280be9dbda746058280e6cffad"`)
    await queryRunner.query(`ALTER TABLE "info_workers" DROP COLUMN "stateId"`)
    await queryRunner.query(`ALTER TABLE "info_workers" DROP COLUMN "postal_code"`)
  }
}
