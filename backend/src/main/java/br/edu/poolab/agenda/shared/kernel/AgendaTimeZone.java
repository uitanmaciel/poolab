package br.edu.poolab.agenda.shared.kernel;

import java.time.ZoneId;

/** Fuso institucional. Instantes são guardados em UTC; a conversão ocorre na borda da API e no cálculo do ano do código. */
public final class AgendaTimeZone {

	public static final ZoneId ZONE = ZoneId.of("America/Bahia");

	private AgendaTimeZone() { }
}
