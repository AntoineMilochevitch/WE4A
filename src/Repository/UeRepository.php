<?php

namespace App\Repository;

use App\Entity\Ue;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Ue>
 */
class UeRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Ue::class);
    }

    public function allUE(): array{
        return $this->createQueryBuilder('ue')
            ->getQuery()
            ->getArrayResult();
    }

    public function findUsersByCourse(int $courseId): array
    {
        return $this->createQueryBuilder('ue')
            ->select('u.id, u.nom, u.prenom, u.email, r.nom as role')
            ->innerJoin('ue.users', 'uu') // jointure sur user_ue
            ->innerJoin('uu.user', 'u') // jointure des utilisateurs
            ->leftJoin('u.roles', 'r') // récupération des rôles des utilisateurs
            ->where('ue.id = :courseId')
            ->setParameter('courseId', $courseId)
            ->getQuery()
            ->getArrayResult();
    }

    //Fonction appelé par la page Recherche de cours quand on appuie sur la loupe pour effectuer la recherche
    //La recherche est effectué sur le code ET le nom de l'ue
    public function findByCode(string $term)
    {
        return $this->createQueryBuilder('u')
            ->where('u.nom LIKE :term OR u.code LIKE :term')
            ->setParameter('term', '%' . $term . '%')
            ->getQuery()
            ->getResult();
    }



    //    /**
    //     * @return Ue[] Returns an array of Ue objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('u')
    //            ->andWhere('u.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('u.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Ue
    //    {
    //        return $this->createQueryBuilder('u')
    //            ->andWhere('u.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
