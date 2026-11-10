package br.edu.poolab.agenda.scheduling.domain.model;

import br.edu.poolab.agenda.scheduling.domain.exception.AppointmentAlreadyCancelledException;
import br.edu.poolab.agenda.scheduling.domain.exception.AppointmentNotEditableException;
import br.edu.poolab.agenda.scheduling.domain.exception.SlotUnavailableException;
import br.edu.poolab.agenda.shared.kernel.AttendanceType;
import br.edu.poolab.agenda.shared.kernel.ValidationException;
import java.time.Instant;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

/** Aggregate root: agendamento de um estudante em um horario. */
public final class Appointment {

	private final UUID id;
	private final AppointmentCode code;
	private final UUID studentId;
	private final Reason reason;
	private final Instant createdAt;
	private UUID slotId;
	private AttendanceType type;
	private UUID professionalId;
	private Instant startsAt;
	private Instant endsAt;
	private AppointmentStatus status;

	private Appointment(UUID id, AppointmentCode code, UUID studentId, Reason reason, Instant createdAt, UUID slotId,
			AttendanceType type, UUID professionalId, Instant startsAt, Instant endsAt, AppointmentStatus status) {
		this.id = id;
		this.code = code;
		this.studentId = studentId;
		this.reason = reason;
		this.createdAt = createdAt;
		this.slotId = slotId;
		this.type = type;
		this.professionalId = professionalId;
		this.startsAt = startsAt;
		this.endsAt = endsAt;
		this.status = status;
	}

	public static Appointment schedule(UUID id, AppointmentCode code, UUID studentId, Slot slot, Optional<Reason> reason,
			Instant now) {
		if (!slot.isBookableAt(now)) {
			throw new SlotUnavailableException();
		}
		return new Appointment(id, code, studentId, reason.orElse(null), now, slot.id(), slot.type(),
				slot.professionalId(), slot.startsAt(), slot.endsAt(), AppointmentStatus.CONFIRMED);
	}

	public static Appointment restore(UUID id, AppointmentCode code, UUID studentId, Reason reason, Instant createdAt,
			UUID slotId, AttendanceType type, UUID professionalId, Instant startsAt, Instant endsAt,
			AppointmentStatus status) {
		return new Appointment(id, code, studentId, reason, createdAt, slotId, type, professionalId, startsAt, endsAt,
				status);
	}

	/** Editavel somente se confirmado e ainda nao iniciado. */
	public boolean isEditableAt(Instant now) {
		return status == AppointmentStatus.CONFIRMED && startsAt.isAfter(now);
	}

	public AppointmentStatus statusAt(Instant now) {
		if (status == AppointmentStatus.CANCELLED) {
			return AppointmentStatus.CANCELLED;
		}
		return endsAt.isAfter(now) ? AppointmentStatus.CONFIRMED : AppointmentStatus.COMPLETED;
	}

	public void ensureEditableAt(Instant now) {
		if (status == AppointmentStatus.CANCELLED) {
			throw new AppointmentAlreadyCancelledException();
		}
		if (!isEditableAt(now)) {
			throw new AppointmentNotEditableException();
		}
	}

	public void cancel(Instant now) {
		ensureEditableAt(now);
		status = AppointmentStatus.CANCELLED;
	}

	/** Mesmo tipo e, quando houver, mesmo responsavel. O horario anterior e liberado pelo proprio banco ao trocar slotId. */
	public void reschedule(Slot newSlot, Instant now) {
		ensureEditableAt(now);
		if (newSlot.type() != type || !Objects.equals(newSlot.professionalId(), professionalId)) {
			throw new ValidationException("slotId", "O novo horário deve ser do mesmo tipo e do mesmo responsável.");
		}
		if (newSlot.id().equals(slotId) || !newSlot.isBookableAt(now)) {
			throw new SlotUnavailableException();
		}
		slotId = newSlot.id();
		startsAt = newSlot.startsAt();
		endsAt = newSlot.endsAt();
	}

	public UUID id() {
		return id;
	}

	public AppointmentCode code() {
		return code;
	}

	public UUID studentId() {
		return studentId;
	}

	public Optional<Reason> reason() {
		return Optional.ofNullable(reason);
	}

	public Instant createdAt() {
		return createdAt;
	}

	public UUID slotId() {
		return slotId;
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

	/** Estado persistido (CONFIRMED ou CANCELLED). Use statusAt para o estado exibido. */
	public AppointmentStatus persistedStatus() {
		return status;
	}
}
