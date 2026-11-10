package br.edu.poolab.agenda.shared.infrastructure.config;

import java.time.Clock;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
class ClockConfig {

	/** Relógio injetável: o domínio recebe "agora" como valor, o que torna as regras testáveis. */
	@Bean
	Clock clock() {
		return Clock.systemUTC();
	}
}
