package br.edu.poolab.agenda.catalog.domain.repository;

import br.edu.poolab.agenda.catalog.domain.model.Course;
import java.util.List;

public interface CourseRepository {

	List<Course> findAll();
	Course save(Course course);
}
