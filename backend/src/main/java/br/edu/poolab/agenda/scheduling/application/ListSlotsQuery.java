package br.edu.poolab.agenda.scheduling.application;

import br.edu.poolab.agenda.shared.kernel.AttendanceType;
import java.util.UUID;

public record ListSlotsQuery(AttendanceType type, UUID professionalId) {
}
