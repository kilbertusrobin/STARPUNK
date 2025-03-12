<?php

namespace App\DBAL\Types;

use Doctrine\DBAL\Platforms\AbstractPlatform;
use Doctrine\DBAL\Types\Type;

class RegClassType extends Type
{
    public const NAME = 'regclass'; // Le nom du type tel qu'il est utilisé dans la base de données

    public function getSQLDeclaration(array $column, AbstractPlatform $platform)
    {
        // Tu peux le mapper à un type comme VARCHAR ou un autre type compatible avec PostgreSQL
        return $platform->getVarcharTypeDeclarationSQL($column);
    }

    public function convertToPHPValue($value, AbstractPlatform $platform)
    {
        // Tu peux ici convertir la valeur en une chaîne de caractères, ou ce qui est approprié
        return (string) $value;
    }

    public function getName()
    {
        return self::NAME;
    }
}
