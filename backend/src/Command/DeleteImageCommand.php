<?php

namespace App\Command;

use App\Service\ImageService;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'DeleteImageCommand',
    description: 'Supprimer les images expirées',
)]
class DeleteImageCommand extends Command
{
    private ImageService $imageService;

    public function __construct(ImageService $imageService)
    {
        $this->imageService = $imageService;
        parent::__construct();
    }

    protected function configure(): void
    {
        $this
            ->setDescription('Delete an expired image')
            ->setHelp('This command delete an expired image...');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
    
        $response = $this->imageService->getExpiredImages();
    
        $responseData = json_decode($response->getContent(), true);
    
        if ($response->getStatusCode() === 200 && $responseData === "Aucune image expirée") {
            $io->success("Aucune image expirée à supprimer.");
            return Command::SUCCESS;
        }
    
        if (!empty($responseData)) {
            foreach ($responseData as $imageData) {
                try {
                    $this->imageService->delete(['id' => $imageData['id']]);
                    $io->success("Image expirée supprimée avec succès.");
                } catch (\Exception $e) {
                    $io->error("Erreur lors de la suppression de l'image: " . $e->getMessage());
                }
            }
        }
    
        return Command::SUCCESS;
    }
}