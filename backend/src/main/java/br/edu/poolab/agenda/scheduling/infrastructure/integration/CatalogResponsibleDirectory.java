package br.edu.poolab.agenda.scheduling.infrastructure.integration;

import br.edu.poolab.agenda.catalog.application.GetProfessionalsByIdHandler;
import br.edu.poolab.agenda.catalog.application.ProfessionalSummary;
import br.edu.poolab.agenda.scheduling.application.ResponsibleInfo;
import br.edu.poolab.agenda.scheduling.application.port.ResponsibleDirectory;
import java.util.Collection;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

/** Adapter: busca dados de exibicao do responsavel pelo handle do catalogo. */
@Component
class CatalogResponsibleDirectory implements ResponsibleDirectory {

	private final GetProfessionalsByIdHandler handler;

	CatalogResponsibleDirectory(GetProfessionalsByIdHandler handler) {
		this.handler = handler;
	}

	@Override
	public Map<UUID, ResponsibleInfo> findByIds(Collection<UUID> ids) {
		return handler.handle(ids).stream().collect(Collectors.toMap(ProfessionalSummary::id,
				s -> new ResponsibleInfo(s.id(), s.name(), s.role(), s.courseCode(), s.courseName())));
	}
}
