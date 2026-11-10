package br.edu.poolab.agenda.scheduling.application;

import java.util.UUID;

public record CreateAppointmentCommand(UUID studentId, UUID slotId, String reason) {
}
