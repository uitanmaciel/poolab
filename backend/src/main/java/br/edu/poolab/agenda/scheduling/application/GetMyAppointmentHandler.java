package br.edu.poolab.agenda.scheduling.application;

import br.edu.poolab.agenda.scheduling.domain.repository.AppointmentRepository;
import br.edu.poolab.agenda.shared.kernel.NotFoundException;
import java.time.Clock;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class GetMyAppointmentHandler {

	private final AppointmentRepository appointments;
	private final AppointmentViewAssembler assembler;
	private final Clock clock;

	public GetMyAppointmentHandler(AppointmentRepository appointments, AppointmentViewAssembler assembler,
			Clock clock) {
		this.appointments = appointments;
		this.assembler = assembler;
		this.clock = clock;
	}

	/** Agendamento de outro estudante responde como inexistente, sem revelar qual. */
	@Transactional(readOnly = true)
	public AppointmentView handle(String code, UUID studentId) {
		var now = clock.instant();
		var appointment = appointments.findByCodeAndStudentId(code, studentId)
				.orElseThrow(() -> new NotFoundException("Agendamento não encontrado."));
		return assembler.toView(appointment, now);
	}
}
