package br.edu.poolab.agenda.scheduling.domain.model;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import br.edu.poolab.agenda.shared.kernel.ValidationException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.ValueSource;

class ReasonTest {

	@ParameterizedTest
	@NullAndEmptySource
	@ValueSource(strings = {"   ", "\t\n"})
	void blankReasonBecomesAbsent(String raw) {
		assertThat(Reason.fromInput(raw)).isEmpty();
	}

	@Test
	void trimsSurroundingSpaces() {
		assertThat(Reason.fromInput("  Dúvida sobre a prova ").orElseThrow().value()).isEqualTo("Dúvida sobre a prova");
	}

	@Test
	void acceptsExactlyMaxLength() {
		String max = "a".repeat(Reason.MAX_LENGTH);
		assertThat(Reason.fromInput(max).orElseThrow().value()).hasSize(255);
	}

	@Test
	void rejectsMoreThanMaxLength() {
		assertThatThrownBy(() -> Reason.fromInput("a".repeat(Reason.MAX_LENGTH + 1)))
				.isInstanceOf(ValidationException.class);
	}
}
