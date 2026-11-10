package br.edu.poolab.agenda.scheduling.domain.exception;

import br.edu.poolab.agenda.shared.kernel.DomainException;
import br.edu.poolab.agenda.shared.kernel.ErrorCode;

public class SlotUnavailableException extends DomainException {

	public SlotUnavailableException() {
		super(ErrorCode.SLOT_UNAVAILABLE, "Esse horário acabou de ser ocupado.");
	}
}
