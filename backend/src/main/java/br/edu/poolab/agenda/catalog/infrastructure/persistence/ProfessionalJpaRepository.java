package br.edu.poolab.agenda.catalog.infrastructure.persistence;

import br.edu.poolab.agenda.catalog.domain.model.ProfessorRole;
import java.util.Collection;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

interface ProfessionalJpaRepository extends JpaRepository<ProfessionalJpaEntity, UUID> {

	List<ProfessionalJpaEntity> findByRole(ProfessorRole role);
	List<ProfessionalJpaEntity> findByIdIn(Collection<UUID> ids);
}
