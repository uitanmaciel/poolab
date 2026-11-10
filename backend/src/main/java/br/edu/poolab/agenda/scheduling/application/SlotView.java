package br.edu.poolab.agenda.scheduling.application;

import java.time.Instant;
import java.util.UUID;

public record SlotView(UUID id, Instant startsAt, Instant endsAt, boolean available) {
}
