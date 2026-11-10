package br.edu.poolab.agenda.identity.application;

public record RegisterStudentCommand(String fullName, String enrollment, String courseCode, String email,
		String password) {
}
