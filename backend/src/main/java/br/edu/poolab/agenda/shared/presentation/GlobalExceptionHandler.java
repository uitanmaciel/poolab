package br.edu.poolab.agenda.shared.presentation;

import br.edu.poolab.agenda.shared.kernel.DomainException;
import br.edu.poolab.agenda.shared.kernel.ErrorCode;
import br.edu.poolab.agenda.shared.kernel.FieldError;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

/** Único ponto que traduz exceções em códigos HTTP do contrato (docs/api.md). */
@RestControllerAdvice
class GlobalExceptionHandler {

	private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

	@ExceptionHandler(DomainException.class)
	ResponseEntity<ApiErrorResponse> handleDomain(DomainException ex) {
		return build(statusFor(ex.code()), ex.code(), ex.getMessage(), ex.details());
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	ResponseEntity<ApiErrorResponse> handleBodyValidation(MethodArgumentNotValidException ex) {
		List<FieldError> details = ex.getBindingResult().getFieldErrors().stream()
				.map(f -> new FieldError(f.getField(), f.getDefaultMessage()))
				.toList();
		return build(HttpStatus.BAD_REQUEST, ErrorCode.VALIDATION_ERROR, "Dados inválidos.", details);
	}

	@ExceptionHandler(HttpMessageNotReadableException.class)
	ResponseEntity<ApiErrorResponse> handleUnreadable(HttpMessageNotReadableException ex) {
		return build(HttpStatus.BAD_REQUEST, ErrorCode.VALIDATION_ERROR, "Corpo da requisição inválido.", List.of());
	}

	@ExceptionHandler(MethodArgumentTypeMismatchException.class)
	ResponseEntity<ApiErrorResponse> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
		return build(HttpStatus.BAD_REQUEST, ErrorCode.VALIDATION_ERROR, "Parâmetro inválido.",
				List.of(new FieldError(ex.getName(), "Valor inválido.")));
	}

	@ExceptionHandler(MissingServletRequestParameterException.class)
	ResponseEntity<ApiErrorResponse> handleMissingParam(MissingServletRequestParameterException ex) {
		return build(HttpStatus.BAD_REQUEST, ErrorCode.VALIDATION_ERROR, "Parâmetro obrigatório ausente.",
				List.of(new FieldError(ex.getParameterName(), "Campo obrigatório.")));
	}

	@ExceptionHandler({NoResourceFoundException.class})
	ResponseEntity<ApiErrorResponse> handleNoRoute(NoResourceFoundException ex) {
		return build(HttpStatus.NOT_FOUND, ErrorCode.NOT_FOUND, "Recurso não encontrado.", List.of());
	}

	@ExceptionHandler(HttpRequestMethodNotSupportedException.class)
	ResponseEntity<ApiErrorResponse> handleMethod(HttpRequestMethodNotSupportedException ex) {
		return new ResponseEntity<>(new ApiErrorResponse("METHOD_NOT_ALLOWED", "Método não permitido.", List.of()),
				HttpStatus.METHOD_NOT_ALLOWED);
	}

	@ExceptionHandler(Exception.class)
	ResponseEntity<ApiErrorResponse> handleUnexpected(Exception ex) {
		log.error("Erro inesperado", ex);
		return new ResponseEntity<>(
				new ApiErrorResponse("INTERNAL_ERROR", "Erro interno. Tente novamente.", List.of()),
				HttpStatus.INTERNAL_SERVER_ERROR);
	}

	private static HttpStatus statusFor(ErrorCode code) {
		return switch (code) {
			case VALIDATION_ERROR, INVALID_EMAIL_DOMAIN -> HttpStatus.BAD_REQUEST;
			case UNAUTHORIZED -> HttpStatus.UNAUTHORIZED;
			case NOT_FOUND -> HttpStatus.NOT_FOUND;
			case EMAIL_ALREADY_REGISTERED, SLOT_UNAVAILABLE, APPOINTMENT_ALREADY_CANCELLED,
					APPOINTMENT_NOT_EDITABLE -> HttpStatus.CONFLICT;
		};
	}

	private static ResponseEntity<ApiErrorResponse> build(HttpStatus status, ErrorCode code, String message,
			List<FieldError> details) {
		List<ApiErrorResponse.Detail> mapped = details.stream()
				.map(d -> new ApiErrorResponse.Detail(d.field(), d.message()))
				.toList();
		return new ResponseEntity<>(new ApiErrorResponse(code.name(), message, mapped), status);
	}
}
