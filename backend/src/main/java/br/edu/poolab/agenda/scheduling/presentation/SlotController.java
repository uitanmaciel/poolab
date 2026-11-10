package br.edu.poolab.agenda.scheduling.presentation;

import br.edu.poolab.agenda.scheduling.application.ListSlotsHandler;
import br.edu.poolab.agenda.scheduling.application.ListSlotsQuery;
import br.edu.poolab.agenda.scheduling.application.SlotView;
import br.edu.poolab.agenda.shared.kernel.AttendanceType;
import br.edu.poolab.agenda.shared.presentation.ApiDateTimes;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/slots")
public class SlotController {

	private final ListSlotsHandler listSlots;

	public SlotController(ListSlotsHandler listSlots) {
		this.listSlots = listSlots;
	}

	@GetMapping
	public List<SlotResponse> list(@RequestParam AttendanceType type,
			@RequestParam(required = false) UUID professionalId) {
		return listSlots.handle(new ListSlotsQuery(type, professionalId)).stream().map(SlotResponse::from).toList();
	}

	public record SlotResponse(UUID id, OffsetDateTime startsAt, OffsetDateTime endsAt, boolean available) {

		static SlotResponse from(SlotView v) {
			return new SlotResponse(v.id(), ApiDateTimes.toApi(v.startsAt()), ApiDateTimes.toApi(v.endsAt()),
					v.available());
		}
	}
}
