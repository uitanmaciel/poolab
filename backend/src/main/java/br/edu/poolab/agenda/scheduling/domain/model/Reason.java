package br.edu.poolab.agenda.scheduling.domain.model;

import br.edu.poolab.agenda.shared.kernel.ValidationException;
import java.util.Optional;

/** Value object: motivo opcional do atendimento (ate 255 caracteres). Vazio vira ausente. */
public final class Reason {

	public static final int MAX_LENGTH = 255;

	private final String value;

	private Reason(String value) {
		this.value = value;
	}

	public static Optional<Reason> fromInput(String raw) {
		if (raw == null || raw.isBlank()) {
			return Optional.empty();
		}
		String stripped = raw.strip();
		if (stripped.length() > MAX_LENGTH) {
			throw new ValidationException("reason", "O motivo deve ter no máximo 255 caracteres.");
		}
		return Optional.of(new Reason(stripped));
	}

	/** Reconstituicao a partir do banco (texto ja validado na gravacao). */
	public static Reason restore(String value) {
		return new Reason(value);
	}

	public String value() {
		return value;
	}
}
