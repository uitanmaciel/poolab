package br.edu.poolab.agenda.scheduling.application;

import br.edu.poolab.agenda.scheduling.domain.model.Slot;
import br.edu.poolab.agenda.scheduling.domain.repository.AppointmentRepository;
import br.edu.poolab.agenda.scheduling.domain.repository.SlotRepository;
import br.edu.poolab.agenda.shared.kernel.AttendanceType;
import java.time.Clock;
import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Responsaveis com ao menos um horario disponivel do tipo pedido na janela (alimenta hasSlots). */
@Service
public class FindAvailableProfessionalsHandler {

	private final SlotRepository slots;
	private final AppointmentRepository appointments;
	private final Clock clock;

	public FindAvailableProfessionalsHandler(SlotRepository slots, AppointmentRepository appointments, Clock clock) {
		this.slots = slots;
		this.appointments = appointments;
		this.clock = clock;
	}

	@Transactional(readOnly = true)
	public Set<UUID> handle(Collection<UUID> professionalIds, AttendanceType type) {
		if (professionalIds.isEmpty()) {
			return Set.of();
		}
		Instant now = clock.instant();
		List<Slot> window = slots.findWindowForResponsibles(type, professionalIds, now,
				now.plus(Slot.BOOKING_WINDOW));
		Set<UUID> occupied = appointments.findOccupiedSlotIds(window.stream().map(Slot::id).toList());
		return window.stream()
				.filter(s -> s.isBookableAt(now) && !occupied.contains(s.id()))
				.map(Slot::professionalId)
				.collect(Collectors.toSet());
	}
}
