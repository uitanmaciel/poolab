package br.edu.poolab.agenda.identity.domain.exception;

import br.edu.poolab.agenda.shared.kernel.DomainException;
import br.edu.poolab.agenda.shared.kernel.ErrorCode;

public class EmailAlreadyRegisteredException extends DomainException {

	public EmailAlreadyRegisteredException() {
		super(ErrorCode.EMAIL_ALREADY_REGISTERED, "Já existe um cadastro com este e-mail.");
	}
}
