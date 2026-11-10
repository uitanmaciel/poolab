package br.edu.poolab.agenda.catalog.domain.repository;

import br.edu.poolab.agenda.catalog.domain.model.Professional;
import br.edu.poolab.agenda.catalog.domain.model.ProfessorRole;
import java.util.Collection;
import java.util.UUID;
import java.util.List;

public interface ProfessionalRepository {

	List<Professional> findAll();
	List<Professional> findByRole(ProfessorRole role);
	List<Professional> findByIds(Collection<UUID> ids);
	Professional save(Professional professional);
}
