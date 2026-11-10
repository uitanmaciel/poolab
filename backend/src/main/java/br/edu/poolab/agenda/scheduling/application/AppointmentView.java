package br.edu.poolab.agenda.scheduling.application;

import br.edu.poolab.agenda.shared.kernel.AttendanceType;
import java.time.Instant;

/** Visao de leitura de um agendamento. status e o estado exibido (CONFIRMED, CANCELLED ou COMPLETED). */
public record AppointmentView(String code, String status, AttendanceType type, ResponsibleInfo professional,
		Instant startsAt, Instant endsAt, String reason, boolean editable, Instant previousStartsAt,
		Instant previousEndsAt) {

	/** Preenche o horario anterior (somente no reagendamento). */
	public AppointmentView withPrevious(Instant previousStart, Instant previousEnd) {
		return new AppointmentView(code, status, type, professional, startsAt, endsAt, reason, editable,
				previousStart, previousEnd);
	}
}
