package br.edu.poolab.agenda.catalog.application;

import br.edu.poolab.agenda.catalog.application.port.ProfessionalAvailability;
import br.edu.poolab.agenda.catalog.domain.model.Course;
import br.edu.poolab.agenda.catalog.domain.model.Professional;
import br.edu.poolab.agenda.catalog.domain.model.ProfessorRole;
import br.edu.poolab.agenda.catalog.domain.repository.CourseRepository;
import br.edu.poolab.agenda.catalog.domain.repository.ProfessionalRepository;
import br.edu.poolab.agenda.shared.kernel.AttendanceType;
import br.edu.poolab.agenda.shared.kernel.ValidationException;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ListProfessionalsHandler {

	private final ProfessionalRepository professionals;
	private final CourseRepository courses;
	private final ProfessionalAvailability availability;

	public ListProfessionalsHandler(ProfessionalRepository professionals, CourseRepository courses,
			ProfessionalAvailability availability) {
		this.professionals = professionals;
		this.courses = courses;
		this.availability = availability;
	}

	@Transactional(readOnly = true)
	public List<ProfessionalListItem> handle(AttendanceType type) {
		List<Professional> source = switch (type) {
			case PROFESSOR -> professionals.findAll().stream().filter(Professional::teaches).toList();
			case COORDINATION -> professionals.findByRole(ProfessorRole.COORDINATOR);
			case CRA -> throw new ValidationException("type", "CRA não possui responsável.");
		};
		List<Professional> found = source.stream()
				.sorted(Comparator.comparing(Professional::name))
				.toList();
		Map<String, String> courseNames = courses.findAll().stream()
				.collect(Collectors.toMap(Course::code, Course::name));
		Set<UUID> withSlots = availability.professionalIdsWithAvailableSlots(
				found.stream().map(Professional::id).toList(), type);
		return found.stream()
				.map(p -> new ProfessionalListItem(p.id(), p.name(), p.role().name(), p.courseCode(),
						p.courseCode() == null ? null : courseNames.get(p.courseCode()),
						p.teaches(),
						withSlots.contains(p.id())))
				.toList();
	}
}
