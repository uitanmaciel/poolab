package br.edu.poolab.agenda.identity.application;

import br.edu.poolab.agenda.identity.application.AuthResult.StudentView;
import br.edu.poolab.agenda.identity.domain.repository.StudentRepository;
import br.edu.poolab.agenda.shared.kernel.NotFoundException;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class GetCurrentStudentHandler {

	private final StudentRepository students;

	public GetCurrentStudentHandler(StudentRepository students) {
		this.students = students;
	}

	@Transactional(readOnly = true)
	public StudentView handle(UUID studentId) {
		return students.findById(studentId)
				.map(RegisterStudentHandler::toView)
				.orElseThrow(() -> new NotFoundException("Usuário não encontrado."));
	}
}
