package br.edu.poolab.agenda.identity.domain.model;

import br.edu.poolab.agenda.shared.kernel.ValidationException;
import java.util.UUID;

/** Aggregate root: estudante. A senha chega ja em hash (o hashing e responsabilidade de um port). */
public final class Student {

	private final UUID id;
	private final String fullName;
	private final String enrollment;
	private final String courseCode;
	private final UcsalEmail email;
	private final String passwordHash;

	private Student(UUID id, String fullName, String enrollment, String courseCode, UcsalEmail email,
			String passwordHash) {
		this.id = id;
		this.fullName = fullName;
		this.enrollment = enrollment;
		this.courseCode = courseCode;
		this.email = email;
		this.passwordHash = passwordHash;
	}

	public static Student register(UUID id, String fullName, String enrollment, String courseCode, UcsalEmail email,
			String passwordHash) {
		if (fullName == null || fullName.isBlank()) {
			throw new ValidationException("fullName", "Informe o nome completo.");
		}
		if (passwordHash == null || passwordHash.isBlank()) {
			throw new ValidationException("password", "Informe a senha.");
		}
		return new Student(id, fullName.strip(), enrollment, courseCode, email, passwordHash);
	}

	public static Student restore(UUID id, String fullName, String enrollment, String courseCode, UcsalEmail email,
			String passwordHash) {
		return new Student(id, fullName, enrollment, courseCode, email, passwordHash);
	}

	public UUID id() {
		return id;
	}

	public String fullName() {
		return fullName;
	}

	public String enrollment() {
		return enrollment;
	}

	public String courseCode() {
		return courseCode;
	}

	public UcsalEmail email() {
		return email;
	}

	public String passwordHash() {
		return passwordHash;
	}
}
