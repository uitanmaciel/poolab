package br.edu.poolab.agenda.scheduling.application;

import br.edu.poolab.agenda.scheduling.domain.model.Slot;
import br.edu.poolab.agenda.scheduling.domain.repository.AppointmentRepository;
import br.edu.poolab.agenda.scheduling.domain.repository.SlotRepository;
import br.edu.poolab.agenda.shared.kernel.AttendanceType;
import br.edu.poolab.agenda.shared.kernel.ValidationException;
import java.time.Clock;
import java.time.Instant;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ListSlotsHandler {

	private final SlotRepository slots;
	private final AppointmentRepository appointments;
	private final Clock clock;

	public ListSlotsHandler(SlotRepository slots, AppointmentRepository appointments, Clock clock) {
		this.slots = slots;
		this.appointments = appointments;
		this.clock = clock;
	}

	@Transactional(readOnly = true)
	public List<SlotView> handle(ListSlotsQuery query) {
		// CRA ignora professionalId; os demais tipos exigem o responsavel.
		UUID responsibleId = null;
		if (query.type() != AttendanceType.CRA) {
			if (query.professionalId() == null) {
				throw new ValidationException("professionalId", "Informe o responsável para este tipo de atendimento.");
			}
			responsibleId = query.professionalId();
		}
		Instant now = clock.instant();
		List<Slot> window = slots.findWindow(query.type(), responsibleId, now, now.plus(Slot.BOOKING_WINDOW));
		Set<UUID> occupied = appointments.findOccupiedSlotIds(window.stream().map(Slot::id).toList());
		return window.stream()
				.map(s -> new SlotView(s.id(), s.startsAt(), s.endsAt(),
						s.isBookableAt(now) && !occupied.contains(s.id())))
				.toList();
	}
}
