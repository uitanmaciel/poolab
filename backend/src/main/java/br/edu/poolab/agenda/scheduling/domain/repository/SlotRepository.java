package br.edu.poolab.agenda.scheduling.domain.repository;

import br.edu.poolab.agenda.scheduling.domain.model.Slot;
import br.edu.poolab.agenda.shared.kernel.AttendanceType;
import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SlotRepository {

	Optional<Slot> findById(UUID id);

	/** Horarios com inicio em (from, until]. responsibleId null significa CRA (sem responsavel). */
	List<Slot> findWindow(AttendanceType type, UUID responsibleId, Instant from, Instant until);

	/** Horarios do tipo informado com inicio em (from, until] de qualquer um dos responsaveis informados. */
	List<Slot> findWindowForResponsibles(AttendanceType type, Collection<UUID> responsibleIds, Instant from,
			Instant until);

	void saveAll(Collection<Slot> slots);
}
