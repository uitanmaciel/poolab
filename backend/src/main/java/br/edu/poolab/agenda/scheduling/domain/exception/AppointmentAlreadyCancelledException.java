package br.edu.poolab.agenda.scheduling.domain.exception;

import br.edu.poolab.agenda.shared.kernel.DomainException;
import br.edu.poolab.agenda.shared.kernel.ErrorCode;

public class AppointmentAlreadyCancelledException extends DomainException {

	public AppointmentAlreadyCancelledException() {
		super(ErrorCode.APPOINTMENT_ALREADY_CANCELLED, "Este agendamento já foi cancelado.");
	}
}
