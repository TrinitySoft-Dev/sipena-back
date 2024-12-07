import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddNewFieldPosition1733449251490 implements MigrationInterface {
  name = 'AddNewFieldPosition1733449251490'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "work_field_visibilities" ADD "position" integer`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "work_field_visibilities" DROP COLUMN "position"`)
  }
}
