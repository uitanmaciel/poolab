package br.edu.poolab.agenda.scheduling.application;

import java.util.UUID;

public record RescheduleAppointmentCommand(UUID studentId, String code, UUID slotId) {
}
