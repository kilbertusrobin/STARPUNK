<?php

namespace App\DataFixtures;

use App\Entity\Comment;
use App\Entity\User;
use App\Entity\Image;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;

class CommentFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create('fr_FR');

        $users = $manager->getRepository(User::class)->findAll();
        $images = $manager->getRepository(Image::class)->findAll();


        for ($i = 0; $i < 10; $i++) {
            $comment = new Comment();
            $user = $users[array_rand($users)];
            $comment->setAuthor($user);
            
            $image = $images[array_rand($images)];
            $comment->setImage($image);

            $comment->setContent($faker->sentence());
            $comment->setCreatedAt($faker->dateTimeBetween('-6 months'));


            $manager->persist($comment);
        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            UserFixtures::class, 
            ImageFixtures::class
        ];
    }
}
