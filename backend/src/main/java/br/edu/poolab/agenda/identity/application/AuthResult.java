package br.edu.poolab.agenda.identity.application;

import java.util.UUID;

public record AuthResult(String token, StudentView student) {

	public record StudentView(UUID id, String fullName, String enrollment, String courseCode, String email) {
	}
}
