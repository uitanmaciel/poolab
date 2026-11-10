package br.edu.poolab.agenda.identity.domain.exception;

import br.edu.poolab.agenda.shared.kernel.DomainException;
import br.edu.poolab.agenda.shared.kernel.ErrorCode;

public class InvalidEmailDomainException extends DomainException {

	public InvalidEmailDomainException() {
		super(ErrorCode.INVALID_EMAIL_DOMAIN, "Use um e-mail que termine em @ucsal.edu.br.");
	}
}
