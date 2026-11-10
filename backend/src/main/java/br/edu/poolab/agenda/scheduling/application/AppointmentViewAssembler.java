package br.edu.poolab.agenda.scheduling.application;

import br.edu.poolab.agenda.scheduling.application.port.ResponsibleDirectory;
import br.edu.poolab.agenda.scheduling.domain.model.Appointment;
import br.edu.poolab.agenda.scheduling.domain.model.Reason;
import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

/** Monta as visoes de leitura de agendamentos, buscando os responsaveis em lote. */
@Component
class AppointmentViewAssembler {

	private final ResponsibleDirectory responsibles;

	AppointmentViewAssembler(ResponsibleDirectory responsibles) {
		this.responsibles = responsibles;
	}

	List<AppointmentView> toViews(Collection<Appointment> appointments, Instant now) {
		Set<UUID> responsibleIds = appointments.stream()
				.map(Appointment::professionalId)
				.filter(Objects::nonNull)
				.collect(Collectors.toSet());
		Map<UUID, ResponsibleInfo> infos = responsibleIds.isEmpty() ? Map.of() : responsibles.findByIds(responsibleIds);
		return appointments.stream()
				.map(a -> new AppointmentView(
						a.code().value(),
						a.statusAt(now).name(),
						a.type(),
						a.professionalId() == null ? null : infos.get(a.professionalId()),
						a.startsAt(),
						a.endsAt(),
						a.reason().map(Reason::value).orElse(null),
						a.isEditableAt(now),
						null,
						null))
				.toList();
	}

	AppointmentView toView(Appointment appointment, Instant now) {
		return toViews(List.of(appointment), now).get(0);
	}
}
