package br.edu.poolab.agenda.scheduling.presentation;

import br.edu.poolab.agenda.scheduling.application.AppointmentView;
import br.edu.poolab.agenda.scheduling.application.CancelAppointmentHandler;
import br.edu.poolab.agenda.scheduling.application.CreateAppointmentCommand;
import br.edu.poolab.agenda.scheduling.application.CreateAppointmentHandler;
import br.edu.poolab.agenda.scheduling.application.GetMyAppointmentHandler;
import br.edu.poolab.agenda.scheduling.application.ListMyAppointmentsHandler;
import br.edu.poolab.agenda.scheduling.application.RescheduleAppointmentCommand;
import br.edu.poolab.agenda.scheduling.application.RescheduleAppointmentHandler;
import br.edu.poolab.agenda.scheduling.application.ResponsibleInfo;
import br.edu.poolab.agenda.shared.kernel.AttendanceType;
import br.edu.poolab.agenda.shared.presentation.ApiDateTimes;
import br.edu.poolab.agenda.shared.presentation.CurrentUser;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/appointments")
public class AppointmentController {

	private final CreateAppointmentHandler create;
	private final ListMyAppointmentsHandler listMine;
	private final GetMyAppointmentHandler getMine;
	private final CancelAppointmentHandler cancel;
	private final RescheduleAppointmentHandler reschedule;

	public AppointmentController(CreateAppointmentHandler create, ListMyAppointmentsHandler listMine,
			GetMyAppointmentHandler getMine, CancelAppointmentHandler cancel,
			RescheduleAppointmentHandler reschedule) {
		this.create = create;
		this.listMine = listMine;
		this.getMine = getMine;
		this.cancel = cancel;
		this.reschedule = reschedule;
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public AppointmentResponse create(@AuthenticationPrincipal Jwt jwt,
			@Valid @RequestBody CreateAppointmentRequest body) {
		return AppointmentResponse.from(create.handle(
				new CreateAppointmentCommand(CurrentUser.id(jwt), body.slotId(), body.reason())));
	}

	@GetMapping("/me")
	public List<AppointmentResponse> mine(@AuthenticationPrincipal Jwt jwt) {
		return listMine.handle(CurrentUser.id(jwt)).stream().map(AppointmentResponse::from).toList();
	}

	@GetMapping("/{code}")
	public AppointmentResponse get(@AuthenticationPrincipal Jwt jwt, @PathVariable String code) {
		return AppointmentResponse.from(getMine.handle(code, CurrentUser.id(jwt)));
	}

	@PostMapping("/{code}/cancel")
	public AppointmentResponse cancel(@AuthenticationPrincipal Jwt jwt, @PathVariable String code) {
		return AppointmentResponse.from(cancel.handle(code, CurrentUser.id(jwt)));
	}

	@PostMapping("/{code}/reschedule")
	public AppointmentResponse reschedule(@AuthenticationPrincipal Jwt jwt, @PathVariable String code,
			@Valid @RequestBody RescheduleRequest body) {
		return AppointmentResponse.from(reschedule.handle(
				new RescheduleAppointmentCommand(CurrentUser.id(jwt), code, body.slotId())));
	}

	public record CreateAppointmentRequest(@NotNull UUID slotId, @Size(max = 255) String reason) {
	}

	public record RescheduleRequest(@NotNull UUID slotId) {
	}

	public record ResponsibleResponse(UUID id, String name, String role, String courseCode, String courseName) {

		static ResponsibleResponse from(ResponsibleInfo r) {
			return new ResponsibleResponse(r.id(), r.name(), r.role(), r.courseCode(), r.courseName());
		}
	}

	/** previousStartsAt/previousEndsAt so vem preenchido no reagendamento (null nas demais respostas). */
	public record AppointmentResponse(String code, String status, AttendanceType type,
			ResponsibleResponse professional, OffsetDateTime startsAt, OffsetDateTime endsAt, String reason,
			boolean editable, OffsetDateTime previousStartsAt, OffsetDateTime previousEndsAt) {

		static AppointmentResponse from(AppointmentView v) {
			return new AppointmentResponse(v.code(), v.status(), v.type(),
					v.professional() == null ? null : ResponsibleResponse.from(v.professional()),
					ApiDateTimes.toApi(v.startsAt()), ApiDateTimes.toApi(v.endsAt()), v.reason(), v.editable(),
					v.previousStartsAt() == null ? null : ApiDateTimes.toApi(v.previousStartsAt()),
					v.previousEndsAt() == null ? null : ApiDateTimes.toApi(v.previousEndsAt()));
		}
	}
}
