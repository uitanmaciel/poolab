package br.edu.poolab.agenda.scheduling.domain.model;

import java.util.Locale;
import java.util.Objects;

/** Value object: codigo AGD-AAAA-NNN. Unicidade e garantida pelo banco (contador por ano + constraint). */
public final class AppointmentCode {

	private final String value;

	private AppointmentCode(String value) {
		this.value = value;
	}

	public static AppointmentCode of(int year, long sequence) {
		if (year < 2000 || year > 9999) {
			throw new IllegalArgumentException("Ano fora do intervalo esperado: " + year);
		}
		if (sequence < 1) {
			throw new IllegalArgumentException("A sequência começa em 1.");
		}
		return new AppointmentCode(String.format(Locale.ROOT, "AGD-%04d-%03d", year, sequence));
	}

	/** Reconstituicao a partir do banco; o valor ja foi validado na criacao. */
	public static AppointmentCode restore(String value) {
		return new AppointmentCode(value);
	}

	public String value() {
		return value;
	}

	@Override
	public boolean equals(Object o) {
		return o instanceof AppointmentCode other && value.equals(other.value);
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
