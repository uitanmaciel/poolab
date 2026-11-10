package br.edu.poolab.agenda.catalog.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

interface CourseJpaRepository extends JpaRepository<CourseJpaEntity, String> { }
