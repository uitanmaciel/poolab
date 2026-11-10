package br.edu.poolab.agenda.scheduling.application;

import java.util.UUID;

public record ResponsibleInfo(UUID id, String name, String role, String courseCode, String courseName) {
}
