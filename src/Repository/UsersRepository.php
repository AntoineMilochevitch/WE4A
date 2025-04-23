<?php

namespace App\Repository;

use App\Entity\Users;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Users>
 */
class UsersRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Users::class);
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

    public function countUsersByRole(int $roleLabel): int
    {
        return $this->createQueryBuilder('u')
            ->select('COUNT(u.id)')
            ->join('u.roles', 'r')
            ->where('r.label = :role')
            ->setParameter('role', $roleLabel)
            ->getQuery()
            ->getSingleScalarResult();
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
