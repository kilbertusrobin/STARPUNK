<?php

namespace App\DataFixtures;

use App\Entity\Article;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class ArticleFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create('fr_FR');

        for ($i = 0; $i < 10; $i++) {
            $article = new Article();
            $article->setTitle($faker->sentence(4));
            $article->setContent($faker->text(200));
            $article->setCreatedAt(\DateTimeImmutable::createFromMutable($faker->dateTimeBetween('-6 months')));
            $article->setAuthor($faker->name);
            
            $manager->persist($article);
        }

        $manager->flush();
    }
}
