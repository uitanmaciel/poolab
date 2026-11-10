package br.edu.poolab.agenda.scheduling.domain.model;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.Test;

class AppointmentCodeTest {

	@Test
	void formatsYearAndPaddedSequence() {
		assertThat(AppointmentCode.of(2026, 552).value()).isEqualTo("AGD-2026-552");
		assertThat(AppointmentCode.of(2026, 7).value()).isEqualTo("AGD-2026-007");
	}

	@Test
	void sequenceGrowsBeyondThreeDigitsWithoutTruncation() {
		// Limitacao conhecida: a partir de 1000 o codigo ganha um digito a mais.
		assertThat(AppointmentCode.of(2026, 1000).value()).isEqualTo("AGD-2026-1000");
	}

	@Test
	void rejectsSequenceBelowOne() {
		assertThatThrownBy(() -> AppointmentCode.of(2026, 0)).isInstanceOf(IllegalArgumentException.class);
	}

	@Test
	void equalityIsByValue() {
		assertThat(AppointmentCode.restore("AGD-2026-001")).isEqualTo(AppointmentCode.of(2026, 1));
	}
}
