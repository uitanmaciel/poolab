package br.edu.poolab.agenda.shared.kernel;

import java.util.List;

/** Base de todas as regras de negócio violadas. O código define o mapeamento HTTP na presentation. */
public abstract class DomainException extends RuntimeException {

	private final ErrorCode code;
	private final List<FieldError> details;

	protected DomainException(ErrorCode code, String message, List<FieldError> details) {
		super(message);
		this.code = code;
		this.details = List.copyOf(details);
	}

	protected DomainException(ErrorCode code, String message) {
		this(code, message, List.of());
	}
	public ErrorCode code() {
		return code;
	}
	public List<FieldError> details() {
		return details;
	}
}
