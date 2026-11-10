package br.edu.poolab.agenda.scheduling.infrastructure.persistence;

import br.edu.poolab.agenda.scheduling.domain.repository.AppointmentCodeCounter;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/** Contador por ano em uma unica instrucao atomica (upsert). Roda na transacao do agendamento. */
@Component
class JdbcAppointmentCodeCounter implements AppointmentCodeCounter {

	private final JdbcTemplate jdbc;

	JdbcAppointmentCodeCounter(JdbcTemplate jdbc) {
		this.jdbc = jdbc;
	}

	@Override
	public long next(int year) {
		Long value = jdbc.queryForObject("""
				INSERT INTO appointment_sequences (year, last_value) VALUES (?, 1)
				ON CONFLICT (year) DO UPDATE SET last_value = appointment_sequences.last_value + 1
				RETURNING last_value""", Long.class, year);
		return value;
	}
}
