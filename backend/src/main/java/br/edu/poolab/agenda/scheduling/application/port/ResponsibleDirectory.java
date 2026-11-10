package br.edu.poolab.agenda.scheduling.application.port;

import br.edu.poolab.agenda.scheduling.application.ResponsibleInfo;
import java.util.Collection;
import java.util.Map;
import java.util.UUID;

/** Port: dados de exibicao do responsavel (professor ou coordenador), vindos do contexto de catalogo. */
public interface ResponsibleDirectory {

	Map<UUID, ResponsibleInfo> findByIds(Collection<UUID> ids);
}
