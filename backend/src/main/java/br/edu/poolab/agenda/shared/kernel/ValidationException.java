package br.edu.poolab.agenda.shared.kernel;

import java.util.List;

/** Regra de negócio com dado invalido (ex.: horário de outro tipo). */
public class ValidationException extends DomainException {

	public ValidationException(String message) {
		super(ErrorCode.VALIDATION_ERROR, message);
	}

	public ValidationException(String field, String message) {
		super(ErrorCode.VALIDATION_ERROR, "Dados inválidos.", List.of(new FieldError(field, message)));
	}
}
