package br.edu.poolab.agenda.identity.infrastructure.integration;

import br.edu.poolab.agenda.catalog.application.ListCoursesHandler;
import br.edu.poolab.agenda.identity.application.port.CourseDirectory;
import org.springframework.stereotype.Component;

/** Adapter (anti-corruption): consulta cursos pelo handle do contexto de catalogo. */
@Component
class CatalogCourseDirectory implements CourseDirectory {

	private final ListCoursesHandler courses;

	CatalogCourseDirectory(ListCoursesHandler courses) {
		this.courses = courses;
	}

	@Override
	public boolean exists(String courseCode) {
		return courses.handle().stream().anyMatch(c -> c.code().equals(courseCode));
	}
}
