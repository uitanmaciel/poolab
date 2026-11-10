package br.edu.poolab.agenda.catalog.infrastructure.persistence;

import br.edu.poolab.agenda.catalog.domain.model.Course;
import br.edu.poolab.agenda.catalog.domain.repository.CourseRepository;
import java.util.List;
import org.springframework.stereotype.Repository;

@Repository
class CourseRepositoryAdapter implements CourseRepository {

	private final CourseJpaRepository jpa;

	CourseRepositoryAdapter(CourseJpaRepository jpa) {
		this.jpa = jpa;
	}

	@Override
	public List<Course> findAll() {
		return jpa.findAll().stream().map(e -> Course.restore(e.getCode(), e.getName())).toList();
	}

	@Override
	public Course save(Course course) {
		jpa.saveAndFlush(new CourseJpaEntity(course.code(), course.name()));
		return course;
	}
}
