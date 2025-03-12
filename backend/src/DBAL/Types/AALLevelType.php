<?php
namespace App\DBAL\Types;

use Doctrine\DBAL\Platforms\AbstractPlatform;
use Doctrine\DBAL\Types\Type;

class AALLevelType extends Type
{
    public const NAME = 'aal_level';

    public function getSQLDeclaration(array $column, AbstractPlatform $platform)
    {
        // Map to a PostgreSQL type like VARCHAR
        return $platform->getVarcharTypeDeclarationSQL($column);
    }

    public function getName()
    {
        return self::NAME;
    }
}