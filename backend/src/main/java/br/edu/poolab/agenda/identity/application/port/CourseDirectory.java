package br.edu.poolab.agenda.identity.application.port;

/** Port: verifica a existencia de um curso no contexto de catalogo. */
public interface CourseDirectory {

	boolean exists(String courseCode);
}
