package br.edu.poolab.agenda.scheduling.domain.model;

import br.edu.poolab.agenda.shared.kernel.AttendanceType;
import br.edu.poolab.agenda.shared.kernel.ValidationException;
import java.time.Duration;
import java.time.Instant;
import java.util.UUID;

/** Entity: horario de atendimento de 30 minutos. Disponibilidade nao e guardada aqui: vem da reserva confirmada. */
public final class Slot {

	public static final Duration DURATION = Duration.ofMinutes(30);
	public static final Duration BOOKING_WINDOW = Duration.ofDays(14);

	private final UUID id;
	private final AttendanceType type;
	private final UUID professionalId;
	private final Instant startsAt;
	private final Instant endsAt;

	private Slot(UUID id, AttendanceType type, UUID professionalId, Instant startsAt, Instant endsAt) {
		this.id = id;
		this.type = type;
		this.professionalId = professionalId;
		this.startsAt = startsAt;
		this.endsAt = endsAt;
	}

	public static Slot create(UUID id, AttendanceType type, UUID professionalId, Instant startsAt) {
		if (type == null || startsAt == null) {
			throw new ValidationException("slot", "Tipo e horário de início são obrigatórios.");
		}
		if ((type == AttendanceType.CRA) != (professionalId == null)) {
			throw new ValidationException("professionalId",
					"Horário de CRA não tem responsável; os demais exigem um.");
		}
		return new Slot(id, type, professionalId, startsAt, startsAt.plus(DURATION));
	}

	public static Slot restore(UUID id, AttendanceType type, UUID professionalId, Instant startsAt, Instant endsAt) {
		return new Slot(id, type, professionalId, startsAt, endsAt);
	}

	/** Agendavel se comeca no futuro e dentro da janela de 14 dias a partir de agora. */
	public boolean isBookableAt(Instant now) {
		return startsAt.isAfter(now) && !startsAt.isAfter(now.plus(BOOKING_WINDOW));
	}

	public UUID id() {
		return id;
	}

	public AttendanceType type() {
		return type;
	}

	public UUID professionalId() {
		return professionalId;
	}

	public Instant startsAt() {
		return startsAt;
	}

	public Instant endsAt() {
		return endsAt;
	}
}
