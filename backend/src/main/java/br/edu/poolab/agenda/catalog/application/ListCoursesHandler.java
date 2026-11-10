package br.edu.poolab.agenda.catalog.application;

import br.edu.poolab.agenda.catalog.domain.repository.CourseRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ListCoursesHandler {

	private final CourseRepository courses;
	public ListCoursesHandler(CourseRepository courses) {
		this.courses = courses;
	}

	@Transactional(readOnly = true)
	public List<CourseView> handle() {
		return courses.findAll().stream().map(c -> new CourseView(c.code(), c.name())).toList();
	}
}
