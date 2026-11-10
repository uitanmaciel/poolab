package br.edu.poolab.agenda.identity.infrastructure.persistence;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

interface StudentJpaRepository extends JpaRepository<StudentJpaEntity, UUID> {

	Optional<StudentJpaEntity> findByEmail(String email);
}
