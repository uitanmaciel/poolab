package br.edu.poolab.agenda.scheduling.domain.model;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import br.edu.poolab.agenda.scheduling.domain.exception.AppointmentAlreadyCancelledException;
import br.edu.poolab.agenda.scheduling.domain.exception.AppointmentNotEditableException;
import br.edu.poolab.agenda.scheduling.domain.exception.SlotUnavailableException;
import br.edu.poolab.agenda.shared.kernel.AttendanceType;
import br.edu.poolab.agenda.shared.kernel.ValidationException;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class AppointmentTest {

	private static final Instant NOW = Instant.parse("2026-11-09T12:00:00Z");
	private static final UUID STUDENT = UUID.randomUUID();
	private static final UUID RAFAEL = UUID.randomUUID();
	private static final UUID MARINA = UUID.randomUUID();

	private Slot slot;
	private Appointment appointment;

	@BeforeEach
	void setUp() {
		slot = Slot.create(UUID.randomUUID(), AttendanceType.PROFESSOR, RAFAEL, NOW.plusSeconds(3600));
		appointment = Appointment.schedule(UUID.randomUUID(), AppointmentCode.of(2026, 1), STUDENT, slot,
				Optional.empty(), NOW);
	}

	@Test
	void newAppointmentIsConfirmedAndEditable() {
		assertThat(appointment.persistedStatus()).isEqualTo(AppointmentStatus.CONFIRMED);
		assertThat(appointment.isEditableAt(NOW)).isTrue();
		assertThat(appointment.statusAt(NOW)).isEqualTo(AppointmentStatus.CONFIRMED);
	}

	@Test
	void cannotBeScheduledInThePast() {
		Slot past = Slot.create(UUID.randomUUID(), AttendanceType.CRA, null, NOW.minusSeconds(60));
		assertThatThrownBy(() -> Appointment.schedule(UUID.randomUUID(), AppointmentCode.of(2026, 2), STUDENT, past,
				Optional.empty(), NOW)).isInstanceOf(SlotUnavailableException.class);
	}

	@Test
	void notEditableOnceStarted() {
		Instant startedAt = slot.startsAt().plusSeconds(1);
		assertThat(appointment.isEditableAt(startedAt)).isFalse();
		assertThatThrownBy(() -> appointment.cancel(startedAt)).isInstanceOf(AppointmentNotEditableException.class);
	}

	@Test
	void completedWhenEndedButStillPersistedAsConfirmed() {
		Instant afterEnd = slot.endsAt().plusSeconds(1);
		assertThat(appointment.persistedStatus()).isEqualTo(AppointmentStatus.CONFIRMED);
		assertThat(appointment.statusAt(afterEnd)).isEqualTo(AppointmentStatus.COMPLETED);
		assertThat(appointment.isEditableAt(afterEnd)).isFalse();
	}

	@Test
	void cancelReleasesAndCannotBeCancelledTwice() {
		appointment.cancel(NOW);
		assertThat(appointment.statusAt(NOW)).isEqualTo(AppointmentStatus.CANCELLED);
		assertThat(appointment.isEditableAt(NOW)).isFalse();
		assertThatThrownBy(() -> appointment.cancel(NOW)).isInstanceOf(AppointmentAlreadyCancelledException.class);
	}

	@Test
	void cancelledTakesPrecedenceOverNotEditable() {
		appointment.cancel(NOW);
		Instant afterStart = slot.startsAt().plusSeconds(1);
		assertThatThrownBy(() -> appointment.cancel(afterStart)).isInstanceOf(AppointmentAlreadyCancelledException.class);
	}

	@Test
	void reschedulesToSameTypeAndResponsible() {
		Slot other = Slot.create(UUID.randomUUID(), AttendanceType.PROFESSOR, RAFAEL, NOW.plusSeconds(7200));
		appointment.reschedule(other, NOW);
		assertThat(appointment.slotId()).isEqualTo(other.id());
		assertThat(appointment.startsAt()).isEqualTo(other.startsAt());
		assertThat(appointment.code().value()).isEqualTo("AGD-2026-001");
	}

	@Test
	void rescheduleRejectsDifferentResponsibleOrType() {
		Slot otherProfessor = Slot.create(UUID.randomUUID(), AttendanceType.PROFESSOR, MARINA, NOW.plusSeconds(7200));
		assertThatThrownBy(() -> appointment.reschedule(otherProfessor, NOW)).isInstanceOf(ValidationException.class);
		Slot cra = Slot.create(UUID.randomUUID(), AttendanceType.CRA, null, NOW.plusSeconds(7200));
		assertThatThrownBy(() -> appointment.reschedule(cra, NOW)).isInstanceOf(ValidationException.class);
	}

	@Test
	void rescheduleRejectsSameSlotAndPastSlot() {
		assertThatThrownBy(() -> appointment.reschedule(slot, NOW)).isInstanceOf(SlotUnavailableException.class);
		Slot past = Slot.create(UUID.randomUUID(), AttendanceType.PROFESSOR, RAFAEL, NOW.minusSeconds(60));
		assertThatThrownBy(() -> appointment.reschedule(past, NOW)).isInstanceOf(SlotUnavailableException.class);
	}

	@Test
	void rescheduleOfCancelledIsAlreadyCancelled() {
		appointment.cancel(NOW);
		Slot other = Slot.create(UUID.randomUUID(), AttendanceType.PROFESSOR, RAFAEL, NOW.plusSeconds(7200));
		assertThatThrownBy(() -> appointment.reschedule(other, NOW))
				.isInstanceOf(AppointmentAlreadyCancelledException.class);
	}

	@Test
	void reasonIsOptional() {
		assertThat(appointment.reason()).isEmpty();
	}
}
