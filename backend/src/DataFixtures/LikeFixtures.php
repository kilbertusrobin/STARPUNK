<?php

namespace App\DataFixtures;

use App\Entity\Like;
use App\Entity\User;
use App\Entity\Image;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;

class LikeFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create('fr_FR');

        $users = $manager->getRepository(User::class)->findAll();
        $images = $manager->getRepository(Image::class)->findAll();


        for ($i = 0; $i < 10; $i++) {
            $like = new Like();
            $user = $users[array_rand($users)];
            $like->setUser($user);
            
            $image = $images[array_rand($images)];
            $like->setImage($image);


            $manager->persist($like);
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
