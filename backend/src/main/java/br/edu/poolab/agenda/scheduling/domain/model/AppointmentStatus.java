package br.edu.poolab.agenda.scheduling.domain.model;

/** CONFIRMED e CANCELLED sao persistidos; COMPLETED e derivado (CONFIRMED com fim no passado). */
public enum AppointmentStatus {
	CONFIRMED,
	CANCELLED,
	COMPLETED
}
