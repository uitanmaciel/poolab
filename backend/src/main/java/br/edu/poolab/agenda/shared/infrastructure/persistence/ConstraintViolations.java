package br.edu.poolab.agenda.shared.infrastructure.persistence;

import org.springframework.dao.DataIntegrityViolationException;

public final class ConstraintViolations {

	private ConstraintViolations() {
	}

	/** Identifica qual restrição do banco foi violada, para não confundir unicidades diferentes. */
	public static boolean violates(DataIntegrityViolationException e, String constraintName) {
		String message = e.getMostSpecificCause().getMessage();
		return message != null && message.contains(constraintName);
	}
}
