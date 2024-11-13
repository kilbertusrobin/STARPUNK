<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use App\Entity\Image;
use App\Repository\ImageRepository;
use App\Entity\Like;
use App\Repository\LikeRepository;
use App\Entity\Comment;
use App\Repository\CommentRepository;
use Doctrine\Persistence\ObjectManager;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {   


        // $product = new Product();
        // $manager->persist($product);

        $manager->flush();
    }
}
