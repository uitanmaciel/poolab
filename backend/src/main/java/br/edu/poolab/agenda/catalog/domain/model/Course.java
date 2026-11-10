package br.edu.poolab.agenda.catalog.domain.model;

import br.edu.poolab.agenda.shared.kernel.ValidationException;

/** Entity: curso, identificado pelo código (ex.: ADM). */
public final class Course {

	private final String code;
	private final String name;

	private Course(String code, String name) {
		this.code = code;
		this.name = name;
	}

	public static Course create(String code, String name) {
		if (code == null || code.isBlank()) {
			throw new ValidationException("courseCode", "Informe o código do curso.");
		}
		if (name == null || name.isBlank()) {
			throw new ValidationException("courseName", "Informe o nome do curso.");
		}
		return new Course(code.strip().toUpperCase(java.util.Locale.ROOT), name.strip());
	}

	public static Course restore(String code, String name) {
		return new Course(code, name);
	}

	public String code() {
		return code;
	}
	public String name() {
		return name;
	}
}
