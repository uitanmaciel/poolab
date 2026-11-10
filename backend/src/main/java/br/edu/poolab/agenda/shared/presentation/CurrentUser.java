package br.edu.poolab.agenda.shared.presentation;

import java.util.UUID;
import org.springframework.security.oauth2.jwt.Jwt;

public final class CurrentUser {

	private CurrentUser() { }

	/** O subject do JWT é o id do estudante. */
	public static UUID id(Jwt jwt) {
        String subject = jwt.getSubject();
        assert subject != null;
        return UUID.fromString(subject);
	}
}
