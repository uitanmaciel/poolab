package br.edu.poolab.agenda.identity.application;

import br.edu.poolab.agenda.identity.application.AuthResult.StudentView;
import br.edu.poolab.agenda.identity.application.port.PasswordHasher;
import br.edu.poolab.agenda.identity.application.port.TokenIssuer;
import br.edu.poolab.agenda.identity.domain.exception.InvalidEmailDomainException;
import br.edu.poolab.agenda.identity.domain.model.Student;
import br.edu.poolab.agenda.identity.domain.model.UcsalEmail;
import br.edu.poolab.agenda.identity.domain.repository.StudentRepository;
import br.edu.poolab.agenda.shared.kernel.UnauthorizedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LoginHandler {

	private static final String INVALID_CREDENTIALS = "E-mail ou senha inválidos.";

	private final StudentRepository students;
	private final PasswordHasher passwordHasher;
	private final TokenIssuer tokenIssuer;

	public LoginHandler(StudentRepository students, PasswordHasher passwordHasher, TokenIssuer tokenIssuer) {
		this.students = students;
		this.passwordHasher = passwordHasher;
		this.tokenIssuer = tokenIssuer;
	}

	@Transactional(readOnly = true)
	public AuthResult handle(LoginCommand command) {
		UcsalEmail email;
		try {
			email = UcsalEmail.of(command.email());
		} catch (InvalidEmailDomainException e) {
			// Mesma resposta de credencial errada: nao revela quais domínios existem.
			throw new UnauthorizedException(INVALID_CREDENTIALS);
		}
		Student student = students.findByEmail(email).orElseThrow(() -> new UnauthorizedException(INVALID_CREDENTIALS));
		if (!passwordHasher.matches(command.password(), student.passwordHash())) {
			throw new UnauthorizedException(INVALID_CREDENTIALS);
		}
		return new AuthResult(tokenIssuer.issue(student.id()), RegisterStudentHandler.toView(student));
	}
}
