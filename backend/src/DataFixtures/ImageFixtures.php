<?php

namespace App\DataFixtures;

use App\Entity\Image;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;

class ImageFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create('fr_FR');

        $users = $manager->getRepository(User::class)->findAll();


        for ($i = 0; $i < 10; $i++) {
            $image = new Image();
            $image->setUrl("http://localhost:8000/uploads/images/673463d0364b4.png");
            $image->setStatus(0);
            $image->setTitle($faker->sentence(4));
            $image->setDescription($faker->text(200));

            $user = $users[array_rand($users)];
            $image->setUser($user);

            $manager->persist($image);
        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            UserFixtures::class, 
        ];
    }
}
