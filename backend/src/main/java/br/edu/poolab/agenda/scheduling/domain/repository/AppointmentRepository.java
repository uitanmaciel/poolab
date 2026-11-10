package br.edu.poolab.agenda.scheduling.domain.repository;

import br.edu.poolab.agenda.scheduling.domain.model.Appointment;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

public interface AppointmentRepository {

	/** Lanca SlotUnavailableException se a restricao de horario unico (confirmado) for violada. */
	Appointment save(Appointment appointment);

	Optional<Appointment> findByCodeAndStudentId(String code, UUID studentId);

	List<Appointment> findByStudentId(UUID studentId);

	/** Horarios que possuem agendamento confirmado. */
	Set<UUID> findOccupiedSlotIds(Collection<UUID> slotIds);
}
