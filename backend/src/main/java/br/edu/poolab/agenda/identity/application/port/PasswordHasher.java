package br.edu.poolab.agenda.identity.application.port;

public interface PasswordHasher {

	String hash(String rawPassword);

	boolean matches(String rawPassword, String passwordHash);
}
