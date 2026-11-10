package br.edu.poolab.agenda.catalog.infrastructure.persistence;

import br.edu.poolab.agenda.catalog.domain.model.ProfessorRole;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.UUID;

@Entity
@Table(name = "professionals")
public class ProfessionalJpaEntity {

	@Id
	private UUID id;

	@Column(nullable = false)
	private String name;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private ProfessorRole role;

	@Column(name = "course_code")
	private String courseCode;

	@Column(nullable = false)
	private boolean teaches;

	protected ProfessionalJpaEntity() {
	}

	public ProfessionalJpaEntity(UUID id, String name, ProfessorRole role, String courseCode, boolean teaches) {
		this.id = id;
		this.name = name;
		this.role = role;
		this.courseCode = courseCode;
		this.teaches = teaches;
	}

	public UUID getId() {
		return id;
	}

	public String getName() {
		return name;
	}

	public ProfessorRole getRole() {
		return role;
	}

	public String getCourseCode() {
		return courseCode;
	}

	public boolean isTeaches() {
		return teaches;
	}
}
