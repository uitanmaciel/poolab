package br.edu.poolab.agenda.scheduling.infrastructure.persistence;

import br.edu.poolab.agenda.scheduling.domain.model.Slot;
import br.edu.poolab.agenda.scheduling.domain.repository.SlotRepository;
import br.edu.poolab.agenda.shared.kernel.AttendanceType;
import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Repository;

@Repository
class SlotRepositoryAdapter implements SlotRepository {

	private final SlotJpaRepository jpa;

	SlotRepositoryAdapter(SlotJpaRepository jpa) {
		this.jpa = jpa;
	}

	@Override
	public Optional<Slot> findById(UUID id) {
		return jpa.findById(id).map(SlotRepositoryAdapter::toDomain);
	}

	@Override
	public List<Slot> findWindow(AttendanceType type, UUID responsibleId, Instant from, Instant until) {
		List<SlotJpaEntity> rows = responsibleId == null
				? jpa.findWindowWithoutResponsible(type, from, until)
				: jpa.findWindowForResponsible(type, responsibleId, from, until);
		return rows.stream().map(SlotRepositoryAdapter::toDomain).toList();
	}

	@Override
	public List<Slot> findWindowForResponsibles(AttendanceType type, Collection<UUID> responsibleIds, Instant from,
			Instant until) {
		return jpa.findWindowForResponsibles(type, responsibleIds, from, until).stream()
				.map(SlotRepositoryAdapter::toDomain)
				.toList();
	}

	@Override
	public void saveAll(Collection<Slot> slots) {
		jpa.saveAllAndFlush(slots.stream()
				.map(s -> new SlotJpaEntity(s.id(), s.type(), s.professionalId(), s.startsAt(), s.endsAt()))
				.toList());
	}

	private static Slot toDomain(SlotJpaEntity e) {
		return Slot.restore(e.getId(), e.getAttendanceType(), e.getProfessionalId(), e.getStartsAt(), e.getEndsAt());
	}
}
