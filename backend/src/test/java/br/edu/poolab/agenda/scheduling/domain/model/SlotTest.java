package br.edu.poolab.agenda.scheduling.domain.model;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import br.edu.poolab.agenda.shared.kernel.AttendanceType;
import br.edu.poolab.agenda.shared.kernel.ValidationException;
import java.time.Duration;
import java.time.Instant;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class SlotTest {

	private static final Instant NOW = Instant.parse("2026-11-09T12:00:00Z");

	@Test
	void slotLastsThirtyMinutes() {
		Slot slot = Slot.create(UUID.randomUUID(), AttendanceType.PROFESSOR, UUID.randomUUID(), NOW.plusSeconds(3600));
		assertThat(Duration.between(slot.startsAt(), slot.endsAt())).isEqualTo(Duration.ofMinutes(30));
	}

	@Test
	void slotStartingNowIsNotBookable() {
		Slot slot = Slot.create(UUID.randomUUID(), AttendanceType.CRA, null, NOW);
		assertThat(slot.isBookableAt(NOW)).isFalse();
	}

	@Test
	void pastSlotIsNotBookable() {
		Slot slot = Slot.create(UUID.randomUUID(), AttendanceType.CRA, null, NOW.minusSeconds(60));
		assertThat(slot.isBookableAt(NOW)).isFalse();
	}

	@Test
	void windowIncludesExactlyFourteenDaysAhead() {
		Instant limit = NOW.plus(Duration.ofDays(14));
		assertThat(Slot.create(UUID.randomUUID(), AttendanceType.CRA, null, limit).isBookableAt(NOW)).isTrue();
		assertThat(Slot.create(UUID.randomUUID(), AttendanceType.CRA, null, limit.plusSeconds(1)).isBookableAt(NOW))
				.isFalse();
	}

	@Test
	void craHasNoResponsibleAndOtherTypesRequireOne() {
		assertThatThrownBy(() -> Slot.create(UUID.randomUUID(), AttendanceType.CRA, UUID.randomUUID(), NOW))
				.isInstanceOf(ValidationException.class);
		assertThatThrownBy(() -> Slot.create(UUID.randomUUID(), AttendanceType.PROFESSOR, null, NOW))
				.isInstanceOf(ValidationException.class);
	}
}
