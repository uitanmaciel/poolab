package br.edu.poolab.agenda.identity.domain.model;

import br.edu.poolab.agenda.identity.domain.exception.InvalidEmailDomainException;
import java.util.Locale;
import java.util.Objects;

/** Value object: e-mail institucional. Valida o dominio, nao a posse do endereco. */
public final class UcsalEmail {

	private static final String DOMAIN_SUFFIX = "@ucsal.edu.br";

	private final String value;

	private UcsalEmail(String value) {
		this.value = value;
	}

	public static UcsalEmail of(String raw) {
		String normalized = raw == null ? "" : raw.strip().toLowerCase(Locale.ROOT);
		if (!normalized.endsWith(DOMAIN_SUFFIX)) {
			throw new InvalidEmailDomainException();
		}
		String localPart = normalized.substring(0, normalized.length() - DOMAIN_SUFFIX.length());
		if (localPart.isEmpty() || localPart.contains("@") || localPart.chars().anyMatch(Character::isWhitespace)) {
			throw new InvalidEmailDomainException();
		}
		return new UcsalEmail(normalized);
	}

	public String value() {
		return value;
	}

	@Override
	public boolean equals(Object o) {
		return o instanceof UcsalEmail other && value.equals(other.value);
	}

	@Override
	public int hashCode() {
		return Objects.hash(value);
	}

	@Override
	public String toString() {
		return value;
	}
}
