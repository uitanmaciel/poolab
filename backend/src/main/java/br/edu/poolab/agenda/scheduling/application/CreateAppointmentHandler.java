package br.edu.poolab.agenda.scheduling.application;

import br.edu.poolab.agenda.scheduling.domain.model.Appointment;
import br.edu.poolab.agenda.scheduling.domain.model.AppointmentCode;
import br.edu.poolab.agenda.scheduling.domain.model.Reason;
import br.edu.poolab.agenda.scheduling.domain.model.Slot;
import br.edu.poolab.agenda.scheduling.domain.repository.AppointmentCodeCounter;
import br.edu.poolab.agenda.scheduling.domain.repository.AppointmentRepository;
import br.edu.poolab.agenda.scheduling.domain.repository.SlotRepository;
import br.edu.poolab.agenda.shared.kernel.AgendaTimeZone;
import br.edu.poolab.agenda.shared.kernel.ValidationException;
import java.time.Clock;
import java.time.Instant;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CreateAppointmentHandler {

	private final SlotRepository slots;
	private final AppointmentRepository appointments;
	private final AppointmentCodeCounter codeCounter;
	private final AppointmentViewAssembler assembler;
	private final Clock clock;

	public CreateAppointmentHandler(SlotRepository slots, AppointmentRepository appointments,
			AppointmentCodeCounter codeCounter, AppointmentViewAssembler assembler, Clock clock) {
		this.slots = slots;
		this.appointments = appointments;
		this.codeCounter = codeCounter;
		this.assembler = assembler;
		this.clock = clock;
	}

	@Transactional
	public AppointmentView handle(CreateAppointmentCommand command) {
		Instant now = clock.instant();
		Slot slot = slots.findById(command.slotId())
				.orElseThrow(() -> new ValidationException("slotId", "Horário não encontrado."));
		int year = now.atZone(AgendaTimeZone.ZONE).getYear();
		AppointmentCode code = AppointmentCode.of(year, codeCounter.next(year));
		// A checagem de horario ocupado fica no banco (indice unico parcial); a excecao sobe da camada de repositorio.
		Appointment appointment = appointments.save(Appointment.schedule(UUID.randomUUID(), code, command.studentId(),
				slot, Reason.fromInput(command.reason()), now));
		return assembler.toView(appointment, now);
	}
}
