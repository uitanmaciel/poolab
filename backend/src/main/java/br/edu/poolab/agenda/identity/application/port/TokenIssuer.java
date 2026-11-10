package br.edu.poolab.agenda.identity.application.port;

import java.util.UUID;

public interface TokenIssuer {

	String issue(UUID studentId);
}
