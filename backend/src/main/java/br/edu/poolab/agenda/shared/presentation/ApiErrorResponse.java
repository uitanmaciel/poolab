package br.edu.poolab.agenda.shared.presentation;

import java.util.List;

/** Envelope de erro do contrato: { code, message, details }. */
public record ApiErrorResponse(String code, String message, List<Detail> details) {

	public record Detail(String field, String message) { }
}
