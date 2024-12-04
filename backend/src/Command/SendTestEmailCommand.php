<?php
namespace App\Command;

use App\Service\EmailService;
use App\Service\ImageService;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class SendTestEmailCommand extends Command
{
    private $emailService;
    private $imageService;

    protected static $defaultName = 'app:send-test-email';

    public function __construct(EmailService $emailService, ImageService $imageService)
    {
        parent::__construct();
        $this->emailService = $emailService;
        $this->imageService = $imageService;
    }

    protected function configure(): void
    {
        $this
            ->setName(self::$defaultName)
            ->setDescription('Send a test email')
            ->setHelp('This command allows you to send a test email...');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $isThereUnvalidImage= $this->imageService->isThereUnvalidated();
        if (!$isThereUnvalidImage) {
            $output->writeln('There are no unvalidated images.');
            return Command::SUCCESS;
        }

        $this->emailService->sendTestEmail();

        $output->writeln('Test email sent successfully.');

        return Command::SUCCESS;
    }
}