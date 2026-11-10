package br.edu.poolab.agenda.shared.presentation;

import br.edu.poolab.agenda.shared.kernel.AgendaTimeZone;
import java.time.Instant;
import java.time.OffsetDateTime;

/** Converte instantes internos (UTC) para o formato da API: ISO-8601 com offset -03:00. */
public final class ApiDateTimes {

	private ApiDateTimes() { }
	public static OffsetDateTime toApi(Instant instant) {
		return instant.atZone(AgendaTimeZone.ZONE).toOffsetDateTime();
	}
}
