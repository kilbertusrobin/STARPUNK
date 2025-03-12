<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250312132710 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Création du schéma initial pour Starpunk';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE article (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            content VARCHAR(2500) NOT NULL,
            author VARCHAR(255) NOT NULL,
            illustration VARCHAR(255),
            created_at TIMESTAMP NOT NULL
        )');
  
        $this->addSql('CREATE TABLE app_user (
          id SERIAL PRIMARY KEY,
          username VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          password VARCHAR(255) NOT NULL,
          roles JSONB NOT NULL,
          profile_pic VARCHAR(255) NOT NULL
        )');
  
        $this->addSql('CREATE TABLE image (
          id SERIAL PRIMARY KEY,
          user_id INT NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
          url VARCHAR(255) NOT NULL,
          status BOOLEAN NOT NULL,
          title VARCHAR(255) NOT NULL,
          description VARCHAR(750) NOT NULL,
          reference INT,
          refusal_date TIMESTAMP
        )');
  
        $this->addSql('CREATE TABLE comment (
          id SERIAL PRIMARY KEY,
          author_id INT NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
          image_id INT NOT NULL REFERENCES image(id) ON DELETE CASCADE,
          parent_id INT REFERENCES comment(id) ON DELETE CASCADE,
          content VARCHAR(255) NOT NULL,
          created_at TIMESTAMP NOT NULL
        )');
  
        $this->addSql('CREATE TABLE "like" (
          id SERIAL PRIMARY KEY,
          user_id INT NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
          image_id INT NOT NULL REFERENCES image(id) ON DELETE CASCADE
        )');
  
        $this->addSql('CREATE TABLE refresh_token (
          id SERIAL PRIMARY KEY,
          user_id INT NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
          token VARCHAR(255) NOT NULL,
          expires_at TIMESTAMP NOT NULL
        )');

    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE "like"');
        $this->addSql('DROP TABLE comment');
        $this->addSql('DROP TABLE refresh_token');
        $this->addSql('DROP TABLE image');
        $this->addSql('DROP TABLE app_user');
        $this->addSql('DROP TABLE article');
    }
}
