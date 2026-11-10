package br.edu.poolab.agenda.catalog.infrastructure.integration;

import br.edu.poolab.agenda.catalog.application.port.ProfessionalAvailability;
import br.edu.poolab.agenda.scheduling.application.FindAvailableProfessionalsHandler;
import br.edu.poolab.agenda.shared.kernel.AttendanceType;
import java.util.Collection;
import java.util.Set;
import java.util.UUID;
import org.springframework.stereotype.Component;

/** Adapter: delega a disponibilidade por tipo ao handle do contexto de agendamento. */
@Component
class SchedulingProfessionalAvailability implements ProfessionalAvailability {

	private final FindAvailableProfessionalsHandler handler;
	SchedulingProfessionalAvailability(FindAvailableProfessionalsHandler handler) {
		this.handler = handler;
	}
	@Override
	public Set<UUID> professionalIdsWithAvailableSlots(Collection<UUID> professionalIds, AttendanceType type) {
		return handler.handle(professionalIds, type);
	}
}
