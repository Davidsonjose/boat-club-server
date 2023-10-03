import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropUniqueConstraintForEmail1635933969825
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `user` DROP INDEX `UQ_email`');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Implement logic to recreate the unique constraint for the email column if needed
  }
}
