package br.edu.poolab.agenda.catalog.domain.model;

import br.edu.poolab.agenda.shared.kernel.ValidationException;
import java.util.UUID;

/**
 * Aggregate root: responsável por atendimento. Coordenador tem curso associado; professor nao.
 * "teaches" indica que leciona (tem horários do tipo PROFESSOR). Um professor sempre leciona.
 * Coordenador pode ou não lecionar (ex.: Tania leciona; Heitor não).
 */
public final class Professional {

	private final UUID id;
	private final String name;
	private final ProfessorRole role;
	private final String courseCode;
	private final boolean teaches;

	private Professional(UUID id, String name, ProfessorRole role, String courseCode, boolean teaches) {
		this.id = id;
		this.name = name;
		this.role = role;
		this.courseCode = courseCode;
		this.teaches = teaches;
	}

	public static Professional create(UUID id, String name, ProfessorRole role, String courseCode, boolean teaches) {
		if (name == null || name.isBlank()) {
			throw new ValidationException("name", "Informe o nome do profissional.");
		}
		boolean hasCourse = courseCode != null && !courseCode.isBlank();
		if (role == ProfessorRole.COORDINATOR && !hasCourse) {
			throw new ValidationException("courseCode", "Coordenador precisa de um curso associado.");
		}
		if (role == ProfessorRole.PROFESSOR && hasCourse) {
			throw new ValidationException("courseCode", "Professor não está associado a curso.");
		}
		if (role == ProfessorRole.PROFESSOR && !teaches) {
			throw new ValidationException("teaches", "Professor leciona por definição.");
		}
		return new Professional(id, name.strip(), role, hasCourse ? courseCode : null, teaches);
	}

	public static Professional restore(UUID id, String name, ProfessorRole role, String courseCode, boolean teaches) {
		return new Professional(id, name, role, courseCode, teaches);
	}

	public UUID id() {
		return id;
	}
	public String name() {
		return name;
	}
	public ProfessorRole role() {
		return role;
	}
	public String courseCode() {
		return courseCode;
	}
	public boolean teaches() {
		return teaches;
	}
}
