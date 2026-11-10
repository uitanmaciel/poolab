package br.edu.poolab.agenda.catalog.infrastructure.persistence;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "courses")
public class CourseJpaEntity {

	@Id
	@Column(length = 10)
	private String code;

	@Column(nullable = false)
	private String name;

	protected CourseJpaEntity() { }

	public CourseJpaEntity(String code, String name) {
		this.code = code;
		this.name = name;
	}

	public String getCode() {
		return code;
	}

	public String getName() {
		return name;
	}
}
