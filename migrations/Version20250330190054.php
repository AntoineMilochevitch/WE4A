<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250330190054 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE TABLE element (id INT AUTO_INCREMENT NOT NULL, id_type_id INT NOT NULL, titre VARCHAR(255) NOT NULL, description LONGTEXT DEFAULT NULL, date DATE NOT NULL, ordre INT DEFAULT NULL, est_visible TINYINT(1) NOT NULL, INDEX IDX_41405E391BD125E3 (id_type_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE notification (id INT AUTO_INCREMENT NOT NULL, type_notif_id INT NOT NULL, message LONGTEXT NOT NULL, est_vu TINYINT(1) NOT NULL, date DATE NOT NULL, INDEX IDX_BF5476CA939E9806 (type_notif_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE role (id INT AUTO_INCREMENT NOT NULL, nom_role VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE section (id INT AUTO_INCREMENT NOT NULL, id_ue_id INT NOT NULL, titre VARCHAR(255) NOT NULL, date DATE NOT NULL, ordre INT DEFAULT NULL, est_epingle TINYINT(1) NOT NULL, est_visible TINYINT(1) NOT NULL, INDEX IDX_2D737AEF8C6DC281 (id_ue_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE section_element (section_id INT NOT NULL, element_id INT NOT NULL, INDEX IDX_93079336D823E37A (section_id), INDEX IDX_930793361F1F2A24 (element_id), PRIMARY KEY(section_id, element_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE type (id INT AUTO_INCREMENT NOT NULL, nom_type VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE type_notif (id INT AUTO_INCREMENT NOT NULL, type_notif VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE ue (id INT AUTO_INCREMENT NOT NULL, code VARCHAR(255) NOT NULL, nom VARCHAR(255) NOT NULL, description VARCHAR(255) DEFAULT NULL, image VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, nom VARCHAR(255) NOT NULL, prenom VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, mdp VARCHAR(255) NOT NULL, avatar VARCHAR(255) DEFAULT NULL, score INT DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE user_role (user_id INT NOT NULL, role_id INT NOT NULL, INDEX IDX_2DE8C6A3A76ED395 (user_id), INDEX IDX_2DE8C6A3D60322AC (role_id), PRIMARY KEY(user_id, role_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE user_notif (user_id INT NOT NULL, notification_id INT NOT NULL, INDEX IDX_22B1F633A76ED395 (user_id), INDEX IDX_22B1F633EF1A9D84 (notification_id), PRIMARY KEY(user_id, notification_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE user_ue (user_id INT NOT NULL, ue_id INT NOT NULL, INDEX IDX_361EBE5EA76ED395 (user_id), INDEX IDX_361EBE5E62E883B1 (ue_id), PRIMARY KEY(user_id, ue_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE messenger_messages (id BIGINT AUTO_INCREMENT NOT NULL, body LONGTEXT NOT NULL, headers LONGTEXT NOT NULL, queue_name VARCHAR(190) NOT NULL, created_at DATETIME NOT NULL COMMENT '(DC2Type:datetime_immutable)', available_at DATETIME NOT NULL COMMENT '(DC2Type:datetime_immutable)', delivered_at DATETIME DEFAULT NULL COMMENT '(DC2Type:datetime_immutable)', INDEX IDX_75EA56E0FB7336F0 (queue_name), INDEX IDX_75EA56E0E3BD61CE (available_at), INDEX IDX_75EA56E016BA31DB (delivered_at), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE element ADD CONSTRAINT FK_41405E391BD125E3 FOREIGN KEY (id_type_id) REFERENCES type (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE notification ADD CONSTRAINT FK_BF5476CA939E9806 FOREIGN KEY (type_notif_id) REFERENCES type_notif (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE section ADD CONSTRAINT FK_2D737AEF8C6DC281 FOREIGN KEY (id_ue_id) REFERENCES ue (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE section_element ADD CONSTRAINT FK_93079336D823E37A FOREIGN KEY (section_id) REFERENCES section (id) ON DELETE CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE section_element ADD CONSTRAINT FK_930793361F1F2A24 FOREIGN KEY (element_id) REFERENCES element (id) ON DELETE CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_role ADD CONSTRAINT FK_2DE8C6A3A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_role ADD CONSTRAINT FK_2DE8C6A3D60322AC FOREIGN KEY (role_id) REFERENCES role (id) ON DELETE CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_notif ADD CONSTRAINT FK_22B1F633A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_notif ADD CONSTRAINT FK_22B1F633EF1A9D84 FOREIGN KEY (notification_id) REFERENCES notification (id) ON DELETE CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_ue ADD CONSTRAINT FK_361EBE5EA76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_ue ADD CONSTRAINT FK_361EBE5E62E883B1 FOREIGN KEY (ue_id) REFERENCES ue (id) ON DELETE CASCADE
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE element DROP FOREIGN KEY FK_41405E391BD125E3
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE notification DROP FOREIGN KEY FK_BF5476CA939E9806
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE section DROP FOREIGN KEY FK_2D737AEF8C6DC281
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE section_element DROP FOREIGN KEY FK_93079336D823E37A
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE section_element DROP FOREIGN KEY FK_930793361F1F2A24
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_role DROP FOREIGN KEY FK_2DE8C6A3A76ED395
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_role DROP FOREIGN KEY FK_2DE8C6A3D60322AC
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_notif DROP FOREIGN KEY FK_22B1F633A76ED395
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_notif DROP FOREIGN KEY FK_22B1F633EF1A9D84
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_ue DROP FOREIGN KEY FK_361EBE5EA76ED395
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_ue DROP FOREIGN KEY FK_361EBE5E62E883B1
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE element
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE notification
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE role
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE section
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE section_element
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE type
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE type_notif
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE ue
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE user
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE user_role
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE user_notif
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE user_ue
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE messenger_messages
        SQL);
    }
}
