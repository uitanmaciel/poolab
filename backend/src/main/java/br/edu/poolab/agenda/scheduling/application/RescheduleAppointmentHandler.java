package br.edu.poolab.agenda.scheduling.application;

import br.edu.poolab.agenda.scheduling.domain.model.Appointment;
import br.edu.poolab.agenda.scheduling.domain.model.Slot;
import br.edu.poolab.agenda.scheduling.domain.repository.AppointmentRepository;
import br.edu.poolab.agenda.scheduling.domain.repository.SlotRepository;
import br.edu.poolab.agenda.shared.kernel.NotFoundException;
import br.edu.poolab.agenda.shared.kernel.ValidationException;
import java.time.Clock;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RescheduleAppointmentHandler {

	private final AppointmentRepository appointments;
	private final SlotRepository slots;
	private final AppointmentViewAssembler assembler;
	private final Clock clock;

	public RescheduleAppointmentHandler(AppointmentRepository appointments, SlotRepository slots,
			AppointmentViewAssembler assembler, Clock clock) {
		this.appointments = appointments;
		this.slots = slots;
		this.assembler = assembler;
		this.clock = clock;
	}

	@Transactional
	public AppointmentView handle(RescheduleAppointmentCommand command) {
		var now = clock.instant();
		Appointment appointment = appointments.findByCodeAndStudentId(command.code(), command.studentId())
				.orElseThrow(() -> new NotFoundException("Agendamento não encontrado."));
		appointment.ensureEditableAt(now);
		Slot newSlot = slots.findById(command.slotId())
				.orElseThrow(() -> new ValidationException("slotId", "Horário não encontrado."));
		var previousStart = appointment.startsAt();
		var previousEnd = appointment.endsAt();
		appointment.reschedule(newSlot, now);
		// Trocar slotId na mesma linha libera o horario anterior na mesma transacao.
		return assembler.toView(appointments.save(appointment), now).withPrevious(previousStart, previousEnd);
	}
}
