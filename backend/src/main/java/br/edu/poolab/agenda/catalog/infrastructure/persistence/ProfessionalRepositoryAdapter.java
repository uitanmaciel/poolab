package br.edu.poolab.agenda.catalog.infrastructure.persistence;

import br.edu.poolab.agenda.catalog.domain.model.Professional;
import br.edu.poolab.agenda.catalog.domain.model.ProfessorRole;
import br.edu.poolab.agenda.catalog.domain.repository.ProfessionalRepository;
import java.util.Collection;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Repository;

@Repository
class ProfessionalRepositoryAdapter implements ProfessionalRepository {

	private final ProfessionalJpaRepository jpa;

	ProfessionalRepositoryAdapter(ProfessionalJpaRepository jpa) {
		this.jpa = jpa;
	}

	@Override
	public List<Professional> findAll() {
		return jpa.findAll().stream().map(ProfessionalRepositoryAdapter::toDomain).toList();
	}

	@Override
	public List<Professional> findByRole(ProfessorRole role) {
		return jpa.findByRole(role).stream().map(ProfessionalRepositoryAdapter::toDomain).toList();
	}

	@Override
	public List<Professional> findByIds(Collection<UUID> ids) {
		return jpa.findByIdIn(ids).stream().map(ProfessionalRepositoryAdapter::toDomain).toList();
	}

	@Override
	public Professional save(Professional p) {
		jpa.saveAndFlush(new ProfessionalJpaEntity(p.id(), p.name(), p.role(), p.courseCode(), p.teaches()));
		return p;
	}

	private static Professional toDomain(ProfessionalJpaEntity e) {
		return Professional.restore(e.getId(), e.getName(), e.getRole(), e.getCourseCode(), e.isTeaches());
	}
}
