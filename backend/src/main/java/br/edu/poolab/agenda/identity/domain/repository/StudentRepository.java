package br.edu.poolab.agenda.identity.domain.repository;

import br.edu.poolab.agenda.identity.domain.model.Student;
import br.edu.poolab.agenda.identity.domain.model.UcsalEmail;
import java.util.Optional;
import java.util.UUID;

public interface StudentRepository {

	Optional<Student> findById(UUID id);

	Optional<Student> findByEmail(UcsalEmail email);

	/** Lanca EmailAlreadyRegisteredException se a restricao de unicidade do banco for violada. */
	Student save(Student student);
}
