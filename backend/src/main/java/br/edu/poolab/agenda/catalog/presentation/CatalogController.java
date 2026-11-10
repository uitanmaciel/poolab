package br.edu.poolab.agenda.catalog.presentation;

import br.edu.poolab.agenda.catalog.application.CourseView;
import br.edu.poolab.agenda.catalog.application.ListCoursesHandler;
import br.edu.poolab.agenda.catalog.application.ListProfessionalsHandler;
import br.edu.poolab.agenda.catalog.application.ProfessionalListItem;
import br.edu.poolab.agenda.shared.kernel.AttendanceType;
import java.util.List;
import java.util.UUID;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class CatalogController {

	private final ListCoursesHandler listCourses;
	private final ListProfessionalsHandler listProfessionals;

	public CatalogController(ListCoursesHandler listCourses, ListProfessionalsHandler listProfessionals) {
		this.listCourses = listCourses;
		this.listProfessionals = listProfessionals;
	}

	@GetMapping("/courses")
	public List<CourseResponse> courses() {
		return listCourses.handle().stream().map(CourseResponse::from).toList();
	}

	@GetMapping("/professionals")
	public List<ProfessionalResponse> professionals(@RequestParam AttendanceType type) {
		return listProfessionals.handle(type).stream().map(ProfessionalResponse::from).toList();
	}

	public record CourseResponse(String code, String name) {

		static CourseResponse from(CourseView v) {
			return new CourseResponse(v.code(), v.name());
		}
	}

	public record ProfessionalResponse(UUID id, String name, String role, String courseCode, String courseName,
			boolean teaches, boolean hasSlots) {

		static ProfessionalResponse from(ProfessionalListItem v) {
			return new ProfessionalResponse(v.id(), v.name(), v.role(), v.courseCode(), v.courseName(), v.teaches(),
					v.hasSlots());
		}
	}
}
