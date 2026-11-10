package br.edu.poolab.agenda.identity.presentation;

import br.edu.poolab.agenda.identity.application.AuthResult;
import br.edu.poolab.agenda.identity.application.GetCurrentStudentHandler;
import br.edu.poolab.agenda.identity.application.LoginCommand;
import br.edu.poolab.agenda.identity.application.LoginHandler;
import br.edu.poolab.agenda.identity.application.RegisterStudentCommand;
import br.edu.poolab.agenda.identity.application.RegisterStudentHandler;
import br.edu.poolab.agenda.identity.application.AuthResult.StudentView;
import br.edu.poolab.agenda.shared.presentation.CurrentUser;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

	/** So formato basico (algo@algo). O dominio @ucsal.edu.br e regra de negocio, validada no UcsalEmail. */
	static final String EMAIL_FORMAT = "^\\s*[^\\s@]+@[^\\s@]+\\s*$";

	private final RegisterStudentHandler register;
	private final LoginHandler login;
	private final GetCurrentStudentHandler currentStudent;

	public AuthController(RegisterStudentHandler register, LoginHandler login,
			GetCurrentStudentHandler currentStudent) {
		this.register = register;
		this.login = login;
		this.currentStudent = currentStudent;
	}

	@PostMapping("/register")
	public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest body) {
		AuthResult result = register.handle(new RegisterStudentCommand(body.fullName(), body.enrollment(),
				body.courseCode(), body.email(), body.password()));
		return ResponseEntity.status(HttpStatus.CREATED).body(AuthResponse.from(result));
	}

	@PostMapping("/login")
	public AuthResponse login(@Valid @RequestBody LoginRequest body) {
		return AuthResponse.from(login.handle(new LoginCommand(body.email(), body.password())));
	}

	@GetMapping("/me")
	public UserResponse me(@AuthenticationPrincipal Jwt jwt) {
		UUID id = CurrentUser.id(jwt);
		return UserResponse.from(currentStudent.handle(id));
	}

	/** Validacao de formato na borda. O dominio do e-mail (@ucsal.edu.br) e checado no handle. */
	public record RegisterRequest(
			@NotBlank @Size(min = 3, max = 120) String fullName,
			@NotBlank @Pattern(regexp = "\\d{4,20}") String enrollment,
			@NotBlank @Size(max = 10) String courseCode,
			@NotBlank @Size(max = 254) @Pattern(regexp = EMAIL_FORMAT) String email,
			@NotBlank @Size(min = 8, max = 72) String password) {
	}

	public record LoginRequest(@NotBlank @Size(max = 254) @Pattern(regexp = EMAIL_FORMAT) String email,
			@NotBlank String password) {
	}

	public record AuthResponse(String token, UserResponse user) {

		static AuthResponse from(AuthResult result) {
			return new AuthResponse(result.token(), UserResponse.from(result.student()));
		}
	}

	public record UserResponse(UUID id, String fullName, String enrollment, String courseCode, String email) {

		static UserResponse from(StudentView s) {
			return new UserResponse(s.id(), s.fullName(), s.enrollment(), s.courseCode(), s.email());
		}
	}
}
