package br.edu.poolab.agenda.shared.kernel;

public class UnauthorizedException extends DomainException {

	public UnauthorizedException(String message) {
		super(ErrorCode.UNAUTHORIZED, message);
	}
}
