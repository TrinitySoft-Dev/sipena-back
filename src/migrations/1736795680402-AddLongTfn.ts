import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddLongTfn1736795680402 implements MigrationInterface {
  name = 'AddLongTfn1736795680402'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1) Eliminar la columna "order" en template_columns
    await queryRunner.query(`ALTER TABLE "template_columns" DROP COLUMN "order"`)

    // 2) Manejo de la columna "tfn"
    await queryRunner.query(`ALTER TABLE "info_workers" DROP COLUMN "tfn"`)
    await queryRunner.query(`
            ALTER TABLE "info_workers"
            ADD "tfn" character varying(50)
            NOT NULL
            DEFAULT 'SIN_TFN'
        `)

    // 3) Manejo de la columna "abn"
    await queryRunner.query(`ALTER TABLE "info_workers" DROP COLUMN "abn"`)
    await queryRunner.query(`
            ALTER TABLE "info_workers"
            ADD "abn" character varying(50)
            NOT NULL
            DEFAULT 'SIN_ABN'
        `)

    // 4) Manejo de la columna "bank_account_number"
    await queryRunner.query(`ALTER TABLE "info_workers" DROP COLUMN "bank_account_number"`)
    await queryRunner.query(`
            ALTER TABLE "info_workers"
            ADD "bank_account_number" character varying(50)
            NOT NULL
            DEFAULT 'SIN_BANCO'
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revertir los cambios (la lógica inversa)

    await queryRunner.query(`ALTER TABLE "info_workers" DROP COLUMN "bank_account_number"`)
    await queryRunner.query(`
            ALTER TABLE "info_workers"
            ADD "bank_account_number" character varying(12)
            NOT NULL
        `)

    await queryRunner.query(`ALTER TABLE "info_workers" DROP COLUMN "abn"`)
    await queryRunner.query(`
            ALTER TABLE "info_workers"
            ADD "abn" character varying(11)
            NOT NULL
        `)

    await queryRunner.query(`ALTER TABLE "info_workers" DROP COLUMN "tfn"`)
    await queryRunner.query(`
            ALTER TABLE "info_workers"
            ADD "tfn" character varying(9)
            NOT NULL
        `)

    await queryRunner.query(`
            ALTER TABLE "template_columns"
            ADD "order" integer
        `)
  }
}
