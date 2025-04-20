<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250418091938 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE TABLE users (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL COMMENT '(DC2Type:json)', password VARCHAR(255) NOT NULL, UNIQUE INDEX UNIQ_IDENTIFIER_EMAIL (email), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE UNIQUE INDEX UNIQ_IDENTIFIER_EMAIL ON user (email)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_ue DROP FOREIGN KEY FK_361EBE5EA76ED395
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_ue DROP FOREIGN KEY FK_361EBE5E62E883B1
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_ue ADD favoris TINYINT(1) NOT NULL, ADD last_visited DATETIME DEFAULT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_ue ADD CONSTRAINT FK_361EBE5EA76ED395 FOREIGN KEY (user_id) REFERENCES user (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_ue ADD CONSTRAINT FK_361EBE5E62E883B1 FOREIGN KEY (ue_id) REFERENCES ue (id)
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            DROP TABLE users
        SQL);
        $this->addSql(<<<'SQL'
            DROP INDEX UNIQ_IDENTIFIER_EMAIL ON user
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_ue DROP FOREIGN KEY FK_361EBE5EA76ED395
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_ue DROP FOREIGN KEY FK_361EBE5E62E883B1
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_ue DROP favoris, DROP last_visited
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_ue ADD CONSTRAINT FK_361EBE5EA76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_ue ADD CONSTRAINT FK_361EBE5E62E883B1 FOREIGN KEY (ue_id) REFERENCES ue (id) ON DELETE CASCADE
        SQL);
    }
}
