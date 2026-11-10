package br.edu.poolab.agenda.scheduling.domain.exception;

import br.edu.poolab.agenda.shared.kernel.DomainException;
import br.edu.poolab.agenda.shared.kernel.ErrorCode;

public class AppointmentNotEditableException extends DomainException {

	public AppointmentNotEditableException() {
		super(ErrorCode.APPOINTMENT_NOT_EDITABLE, "Este agendamento não pode mais ser alterado.");
	}
}
