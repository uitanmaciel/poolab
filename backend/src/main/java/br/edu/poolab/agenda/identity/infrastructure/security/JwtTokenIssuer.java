package br.edu.poolab.agenda.identity.infrastructure.security;

import br.edu.poolab.agenda.identity.application.port.TokenIssuer;
import java.time.Clock;
import java.time.Instant;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.stereotype.Component;

@Component
class JwtTokenIssuer implements TokenIssuer {

	private final JwtEncoder encoder;
	private final Clock clock;
	private final long expirationSeconds;

	JwtTokenIssuer(JwtEncoder encoder, Clock clock,
			@Value("${app.jwt.expiration-seconds}") long expirationSeconds) {
		this.encoder = encoder;
		this.clock = clock;
		this.expirationSeconds = expirationSeconds;
	}

	@Override
	public String issue(UUID studentId) {
		Instant now = clock.instant();
		JwtClaimsSet claims = JwtClaimsSet.builder()
				.issuer("agenda-facil")
				.subject(studentId.toString())
				.issuedAt(now)
				.expiresAt(now.plusSeconds(expirationSeconds))
				.build();
		return encoder.encode(JwtEncoderParameters.from(JwsHeader.with(MacAlgorithm.HS256).build(), claims))
				.getTokenValue();
	}
}
