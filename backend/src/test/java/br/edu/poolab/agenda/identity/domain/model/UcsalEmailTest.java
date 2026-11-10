package br.edu.poolab.agenda.identity.domain.model;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import br.edu.poolab.agenda.identity.domain.exception.InvalidEmailDomainException;
import br.edu.poolab.agenda.shared.kernel.ErrorCode;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

class UcsalEmailTest {

	@Test
	void normalizesAddressToLowerCaseAndStrips() {
		assertThat(UcsalEmail.of("  Ana.Souza@UCSAL.edu.br ").value()).isEqualTo("ana.souza@ucsal.edu.br");
	}

	@ParameterizedTest
	@ValueSource(strings = {"ana@gmail.com", "ana@ucsal.edu.br.com", "ana@sub.ucsal.edu.br", "ucsal.edu.br", "",
			"@ucsal.edu.br", "a@b@ucsal.edu.br", "ana @ucsal.edu.br"})
	void rejectsAddressesOutsideInstitutionalDomain(String raw) {
		assertThatThrownBy(() -> UcsalEmail.of(raw))
				.isInstanceOf(InvalidEmailDomainException.class)
				.extracting(e -> ((InvalidEmailDomainException) e).code())
				.isEqualTo(ErrorCode.INVALID_EMAIL_DOMAIN);
	}

	@Test
	void rejectsNull() {
		assertThatThrownBy(() -> UcsalEmail.of(null)).isInstanceOf(InvalidEmailDomainException.class);
	}
}
