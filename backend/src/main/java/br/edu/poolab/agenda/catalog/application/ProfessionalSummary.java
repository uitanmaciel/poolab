package br.edu.poolab.agenda.catalog.application;

import java.util.UUID;

public record ProfessionalSummary(UUID id, String name, String role, String courseCode, String courseName) { }
