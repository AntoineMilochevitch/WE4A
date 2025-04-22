<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250422124215 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE user_notif DROP FOREIGN KEY FK_22B1F63367B3B43D
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_notif DROP FOREIGN KEY FK_22B1F633EF1A9D84
        SQL);
        $this->addSql(<<<'SQL'
            DROP INDEX IDX_22B1F63367B3B43D ON user_notif
        SQL);
        $this->addSql(<<<'SQL'
            DROP INDEX IDX_22B1F633EF1A9D84 ON user_notif
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_notif ADD est_vu TINYINT(1) DEFAULT 0 NOT NULL
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE user_notif DROP est_vu
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_notif ADD CONSTRAINT FK_22B1F63367B3B43D FOREIGN KEY (users_id) REFERENCES users (id) ON DELETE CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_notif ADD CONSTRAINT FK_22B1F633EF1A9D84 FOREIGN KEY (notification_id) REFERENCES notification (id) ON DELETE CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_22B1F63367B3B43D ON user_notif (users_id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_22B1F633EF1A9D84 ON user_notif (notification_id)
        SQL);
    }
}
