package br.edu.poolab.agenda.identity.application;

import br.edu.poolab.agenda.identity.application.AuthResult.StudentView;
import br.edu.poolab.agenda.identity.application.port.CourseDirectory;
import br.edu.poolab.agenda.identity.application.port.PasswordHasher;
import br.edu.poolab.agenda.identity.application.port.TokenIssuer;
import br.edu.poolab.agenda.identity.domain.exception.EmailAlreadyRegisteredException;
import br.edu.poolab.agenda.identity.domain.model.Student;
import br.edu.poolab.agenda.identity.domain.model.UcsalEmail;
import br.edu.poolab.agenda.identity.domain.repository.StudentRepository;
import br.edu.poolab.agenda.shared.kernel.ValidationException;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RegisterStudentHandler {

	private final StudentRepository students;
	private final PasswordHasher passwordHasher;
	private final TokenIssuer tokenIssuer;
	private final CourseDirectory courses;

	public RegisterStudentHandler(StudentRepository students, PasswordHasher passwordHasher, TokenIssuer tokenIssuer,
			CourseDirectory courses) {
		this.students = students;
		this.passwordHasher = passwordHasher;
		this.tokenIssuer = tokenIssuer;
		this.courses = courses;
	}

	@Transactional
	public AuthResult handle(RegisterStudentCommand command) {
		UcsalEmail email = UcsalEmail.of(command.email());
		if (students.findByEmail(email).isPresent()) {
			throw new EmailAlreadyRegisteredException();
		}
		if (!courses.exists(command.courseCode())) {
			throw new ValidationException("courseCode", "Curso não encontrado.");
		}
		Student student = students.save(Student.register(UUID.randomUUID(), command.fullName(), command.enrollment(),
				command.courseCode(), email, passwordHasher.hash(command.password())));
		return new AuthResult(tokenIssuer.issue(student.id()), toView(student));
	}

	static StudentView toView(Student s) {
		return new StudentView(s.id(), s.fullName(), s.enrollment(), s.courseCode(), s.email().value());
	}
}
