<?php

namespace App\Repository;

use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<User>
 */
class UserRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }

    // find all socre's user
    public function findAllScore(): array
    {
        return $this->createQueryBuilder('u')
            ->select('u.id, u.score')
            ->orderBy('u.score', 'DESC')
            ->getQuery()
            ->getArrayResult();
    }

    public function allUsers(): array{
        return $this->createQueryBuilder('u')
            ->getQuery()
            ->getArrayResult();
    }

    public function findAllUsersEnhanced(): array{
        return $this->createQueryBuilder('u')
            ->select('u.id, u.nom, u.prenom, u.email, r.nom AS role, ue.code AS course_code')
            ->leftJoin('u.roles', 'r')
            ->leftJoin('u.userUes', 'uu')
            ->leftJoin('uu.ue', 'ue')
            ->orderBy('u.id', 'ASC')
            ->getQuery()
            ->getArrayResult();
    }


}
