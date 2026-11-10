package br.edu.poolab.agenda.scheduling.application;

import br.edu.poolab.agenda.scheduling.domain.repository.AppointmentRepository;
import java.time.Clock;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ListMyAppointmentsHandler {

	private final AppointmentRepository appointments;
	private final AppointmentViewAssembler assembler;
	private final Clock clock;

	public ListMyAppointmentsHandler(AppointmentRepository appointments, AppointmentViewAssembler assembler,
			Clock clock) {
		this.appointments = appointments;
		this.assembler = assembler;
		this.clock = clock;
	}

	@Transactional(readOnly = true)
	public List<AppointmentView> handle(UUID studentId) {
		var now = clock.instant();
		var mine = appointments.findByStudentId(studentId).stream()
				.sorted(Comparator.comparing(a -> a.startsAt()))
				.toList();
		return assembler.toViews(mine, now);
	}
}
