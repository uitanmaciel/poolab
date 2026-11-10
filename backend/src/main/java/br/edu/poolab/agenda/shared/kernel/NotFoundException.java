package br.edu.poolab.agenda.shared.kernel;

public class NotFoundException extends DomainException {

	public NotFoundException(String message) {
		super(ErrorCode.NOT_FOUND, message);
	}
}
