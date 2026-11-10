package br.edu.poolab.agenda.catalog.application.port;

import br.edu.poolab.agenda.shared.kernel.AttendanceType;
import java.util.Collection;
import java.util.Set;
import java.util.UUID;

/** Port: quais profissionais tem ao menos um horário disponível do tipo pedido na janela. Implementado pelo contexto de agendamento. */
public interface ProfessionalAvailability {

	Set<UUID> professionalIdsWithAvailableSlots(Collection<UUID> professionalIds, AttendanceType type);
}
