package br.edu.poolab.agenda.scheduling.domain.repository;

/** Port: proxima sequencia do ano (atomica e unica no banco). */
public interface AppointmentCodeCounter {

	long next(int year);
}
