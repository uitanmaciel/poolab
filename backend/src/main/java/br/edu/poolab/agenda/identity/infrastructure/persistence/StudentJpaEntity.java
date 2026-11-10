package br.edu.poolab.agenda.identity.infrastructure.persistence;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.UUID;

@Entity
@Table(name = "students")
public class StudentJpaEntity {

	@Id
	private UUID id;

	@Column(name = "full_name", nullable = false)
	private String fullName;

	@Column(nullable = false)
	private String enrollment;

	@Column(name = "course_code", nullable = false)
	private String courseCode;

	@Column(nullable = false)
	private String email;

	@Column(name = "password_hash", nullable = false)
	private String passwordHash;

	protected StudentJpaEntity() {
	}

	public StudentJpaEntity(UUID id, String fullName, String enrollment, String courseCode, String email,
			String passwordHash) {
		this.id = id;
		this.fullName = fullName;
		this.enrollment = enrollment;
		this.courseCode = courseCode;
		this.email = email;
		this.passwordHash = passwordHash;
	}

	public UUID getId() {
		return id;
	}

	public String getFullName() {
		return fullName;
	}

	public String getEnrollment() {
		return enrollment;
	}

	public String getCourseCode() {
		return courseCode;
	}

	public String getEmail() {
		return email;
	}

	public String getPasswordHash() {
		return passwordHash;
	}
}
