package br.edu.poolab.agenda.catalog.application;

import br.edu.poolab.agenda.catalog.domain.model.Course;
import br.edu.poolab.agenda.catalog.domain.model.Professional;
import br.edu.poolab.agenda.catalog.domain.repository.CourseRepository;
import br.edu.poolab.agenda.catalog.domain.repository.ProfessionalRepository;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class GetProfessionalsByIdHandler {

	private final ProfessionalRepository professionals;
	private final CourseRepository courses;

	public GetProfessionalsByIdHandler(ProfessionalRepository professionals, CourseRepository courses) {
		this.professionals = professionals;
		this.courses = courses;
	}

	@Transactional(readOnly = true)
	public List<ProfessionalSummary> handle(Collection<UUID> ids) {
		if (ids.isEmpty()) {
			return List.of();
		}
		Map<String, String> courseNames = courses.findAll().stream()
				.collect(Collectors.toMap(Course::code, Course::name));
		return professionals.findByIds(ids).stream()
				.map(p -> toSummary(p, courseNames))
				.toList();
	}

	private static ProfessionalSummary toSummary(Professional p, Map<String, String> courseNames) {
		return new ProfessionalSummary(p.id(), p.name(), p.role().name(), p.courseCode(),
				p.courseCode() == null ? null : courseNames.get(p.courseCode()));
	}
}
