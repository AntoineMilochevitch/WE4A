<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250420081049 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE user_role DROP FOREIGN KEY FK_2DE8C6A3A76ED395
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_role DROP FOREIGN KEY FK_2DE8C6A3D60322AC
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE user_role
        SQL);
        $this->addSql(<<<'SQL'
            DROP INDEX UNIQ_IDENTIFIER_EMAIL ON user
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE users ADD nom VARCHAR(255) NOT NULL, ADD prenom VARCHAR(255) NOT NULL, ADD avatar VARCHAR(255) DEFAULT NULL, ADD score INT DEFAULT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_notif DROP FOREIGN KEY FK_22B1F633A76ED395
        SQL);
        $this->addSql(<<<'SQL'
            DROP INDEX IDX_22B1F633A76ED395 ON user_notif
        SQL);
        $this->addSql(<<<'SQL'
            DROP INDEX `primary` ON user_notif
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_notif CHANGE user_id users_id INT NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_notif ADD CONSTRAINT FK_22B1F63367B3B43D FOREIGN KEY (users_id) REFERENCES users (id) ON DELETE CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_22B1F63367B3B43D ON user_notif (users_id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_notif ADD PRIMARY KEY (users_id, notification_id)
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE TABLE user_role (user_id INT NOT NULL, role_id INT NOT NULL, INDEX IDX_2DE8C6A3A76ED395 (user_id), INDEX IDX_2DE8C6A3D60322AC (role_id), PRIMARY KEY(user_id, role_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = '' 
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_role ADD CONSTRAINT FK_2DE8C6A3A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_role ADD CONSTRAINT FK_2DE8C6A3D60322AC FOREIGN KEY (role_id) REFERENCES role (id) ON DELETE CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            CREATE UNIQUE INDEX UNIQ_IDENTIFIER_EMAIL ON user (email)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE users DROP nom, DROP prenom, DROP avatar, DROP score
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_notif DROP FOREIGN KEY FK_22B1F63367B3B43D
        SQL);
        $this->addSql(<<<'SQL'
            DROP INDEX IDX_22B1F63367B3B43D ON user_notif
        SQL);
        $this->addSql(<<<'SQL'
            DROP INDEX `PRIMARY` ON user_notif
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_notif CHANGE users_id user_id INT NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_notif ADD CONSTRAINT FK_22B1F633A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_22B1F633A76ED395 ON user_notif (user_id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_notif ADD PRIMARY KEY (user_id, notification_id)
        SQL);
    }
}
