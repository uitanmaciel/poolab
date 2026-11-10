package br.edu.poolab.agenda;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.postgresql.PostgreSQLContainer;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.json.JsonMapper;

/** Fluxo completo da API contra PostgreSQL 18 real (Testcontainers). Dados do seeder, recriados no boot. */
@Testcontainers
@SpringBootTest(properties = {
		"DB_URL=jdbc:postgresql://localhost:5432/unused",
		"DB_USER=test",
		"DB_PASSWORD=test",
		"JWT_SECRET=teste-segredo-jwt-com-pelo-menos-32-bytes-0123",
		"JWT_EXPIRATION=86400",
		"DEMO_PASSWORD=demo-senha-123",
		"CORS_ORIGINS=http://localhost:5173"
})
@AutoConfigureMockMvc
class AgendaApiIntegrationTest {

	@Container
	@ServiceConnection
	static PostgreSQLContainer postgres = new PostgreSQLContainer("postgres:18-alpine");

	private static final JsonMapper JSON = JsonMapper.builder().build();
	private static final String DEMO_EMAIL = "demo.aluna@ucsal.edu.br";
	private static final String DEMO_PASSWORD = "demo-senha-123";

	@Autowired
	MockMvc mvc;

	@Test
	void registerRejectsEmailOutsideUcsalDomain() throws Exception {
		MvcResult r = post("/api/v1/auth/register", registerBody("ana@gmail.com"), null);
		assertThat(r.getResponse().getStatus()).isEqualTo(400);
		assertThat(json(r).get("code").asText()).isEqualTo("INVALID_EMAIL_DOMAIN");
	}

	@Test
	void registerRejectsMalformedEmailWithFieldDetails() throws Exception {
		MvcResult r = post("/api/v1/auth/register", registerBody("ana@"), null);
		assertThat(r.getResponse().getStatus()).isEqualTo(400);
		assertThat(json(r).get("code").asText()).isEqualTo("VALIDATION_ERROR");
		assertThat(json(r).get("details").get(0).get("field").asText()).isEqualTo("email");
	}

	@Test
	void registerRejectsDuplicateEmail() throws Exception {
		MvcResult r = post("/api/v1/auth/register", registerBody(DEMO_EMAIL), null);
		assertThat(r.getResponse().getStatus()).isEqualTo(409);
		assertThat(json(r).get("code").asText()).isEqualTo("EMAIL_ALREADY_REGISTERED");
	}

	@Test
	void registerThenLoginThenMe() throws Exception {
		String email = "nova.aluna@ucsal.edu.br";
		MvcResult created = post("/api/v1/auth/register", registerBody(email), null);
		assertThat(created.getResponse().getStatus()).isEqualTo(201);
		assertThat(json(created).get("user").get("email").asText()).isEqualTo(email);

		String token = login(email, "senha-forte-123");
		MvcResult me = get("/api/v1/auth/me", token);
		assertThat(me.getResponse().getStatus()).isEqualTo(200);
		assertThat(json(me).get("email").asText()).isEqualTo(email);
	}

	@Test
	void emailIsTrimmedAndLowercasedAndLoginIsCaseInsensitive() throws Exception {
		MvcResult created = post("/api/v1/auth/register", registerBody("  Caixa.Alta@UCSAL.edu.br "), null);
		assertThat(created.getResponse().getStatus()).isEqualTo(201);
		assertThat(json(created).get("user").get("email").asText()).isEqualTo("caixa.alta@ucsal.edu.br");
		assertThat(login("CAIXA.ALTA@ucsal.edu.br", "senha-forte-123")).isNotBlank();
	}

	@Test
	void loginWithWrongPasswordIsUnauthorized() throws Exception {
		MvcResult r = post("/api/v1/auth/login", "{\"email\":\"%s\",\"password\":\"errada-123\"}".formatted(DEMO_EMAIL),
				null);
		assertThat(r.getResponse().getStatus()).isEqualTo(401);
		assertThat(json(r).get("code").asText()).isEqualTo("UNAUTHORIZED");
	}

	@Test
	void coursesArePublicAndProfessorsShowHasSlots() throws Exception {
		MvcResult courses = get("/api/v1/courses", null);
		assertThat(courses.getResponse().getStatus()).isEqualTo(200);
		assertThat(json(courses).toString()).contains("\"ADM\"");

		String token = login(DEMO_EMAIL, DEMO_PASSWORD);
		JsonNode professors = json(get("/api/v1/professionals?type=PROFESSOR", token));
		assertThat(hasSlots(professors, "Profa. Marina Seixas")).isFalse();
		assertThat(hasSlots(professors, "Prof. Rafael Cardoso")).isTrue();
		// Coordenadora tambem aparece na lista de professores, com role COORDINATOR e curso.
		assertThat(professors.toString()).contains("Profa. Tânia Lima").contains("\"role\":\"COORDINATOR\"");

		// Heitor so coordena: fora da lista de professores.
		assertThat(professors.toString()).doesNotContain("Prof. Heitor Mendes");

		// hasSlots e por tipo: Heitor tem horarios COORDINATION, logo true na lista de coordenacao.
		JsonNode coordinators = json(get("/api/v1/professionals?type=COORDINATION", token));
		assertThat(coordinators.get(0).get("role").asText()).isEqualTo("COORDINATOR");
		assertThat(coordinators.toString()).contains("Administração");
		assertThat(hasSlots(coordinators, "Prof. Heitor Mendes")).isTrue();
		assertThat(hasSlots(coordinators, "Profa. Tânia Lima")).isTrue();
		assertThat(teaches(coordinators, "Prof. Heitor Mendes")).isFalse();
		assertThat(teaches(coordinators, "Profa. Tânia Lima")).isTrue();
	}

	@Test
	void coordinatorWithoutTeachingHasNoProfessorSlots() throws Exception {
		String token = login(DEMO_EMAIL, DEMO_PASSWORD);
		String heitorId = professionalId("Prof. Heitor Mendes", token);
		assertThat(json(get("/api/v1/slots?type=PROFESSOR&professionalId=" + heitorId, token))).isEmpty();
		assertThat(json(get("/api/v1/slots?type=COORDINATION&professionalId=" + heitorId, token)).size())
				.isGreaterThan(0);
	}

	@Test
	void slotsRequireAuthenticationAndResponsibleForProfessorType() throws Exception {
		assertThat(get("/api/v1/slots?type=CRA", null).getResponse().getStatus()).isEqualTo(401);
		String token = login(DEMO_EMAIL, DEMO_PASSWORD);
		MvcResult missing = get("/api/v1/slots?type=PROFESSOR", token);
		assertThat(missing.getResponse().getStatus()).isEqualTo(400);
		assertThat(json(missing).get("code").asText()).isEqualTo("VALIDATION_ERROR");
	}

	@Test
	void slotsUseBrasiliaOffsetAndCarryAvailability() throws Exception {
		String token = login(DEMO_EMAIL, DEMO_PASSWORD);
		JsonNode cra = json(get("/api/v1/slots?type=CRA", token));
		assertThat(cra.size()).isGreaterThan(0);
		assertThat(cra.get(0).get("startsAt").asText()).endsWith("-03:00");
		assertThat(cra.get(0).get("available").asBoolean()).isTrue();
	}

	@Test
	void professionalAppointmentLifecycle() throws Exception {
		String token = login(DEMO_EMAIL, DEMO_PASSWORD);
		String rafaelId = professionalId("Prof. Rafael Cardoso", token);
		List<JsonNode> free = availableSlots("PROFESSOR", rafaelId, token);
		assertThat(free.size()).isGreaterThanOrEqualTo(2);
		String slotA = free.get(0).get("id").asText();
		String slotB = free.get(1).get("id").asText();

		// Criar agendamento
		MvcResult created = post("/api/v1/appointments",
				"{\"slotId\":\"%s\",\"reason\":\"Dúvida sobre a prova\"}".formatted(slotA), token);
		assertThat(created.getResponse().getStatus()).isEqualTo(201);
		JsonNode appt = json(created);
		String code = appt.get("code").asText();
		assertThat(code).matches("AGD-\\d{4}-\\d{3,}");
		assertThat(appt.get("status").asText()).isEqualTo("CONFIRMED");
		assertThat(appt.get("editable").asBoolean()).isTrue();
		assertThat(appt.get("professional").get("name").asText()).isEqualTo("Prof. Rafael Cardoso");
		assertThat(appt.get("startsAt").asText()).endsWith("-03:00");
		assertThat(appt.get("reason").asText()).isEqualTo("Dúvida sobre a prova");

		// Mesmo horario de novo: conflito garantido pelo banco
		MvcResult conflict = post("/api/v1/appointments", "{\"slotId\":\"%s\"}".formatted(slotA), token);
		assertThat(conflict.getResponse().getStatus()).isEqualTo(409);
		assertThat(json(conflict).get("code").asText()).isEqualTo("SLOT_UNAVAILABLE");

		// Aparece em "meus agendamentos" e o horario fica indisponivel
		JsonNode mine = json(get("/api/v1/appointments/me", token));
		assertThat(mine.toString()).contains(code);
		assertThat(slotAvailable("PROFESSOR", rafaelId, slotA, token)).isFalse();

		// Reagendar mantem o codigo e libera o horario antigo
		MvcResult moved = post("/api/v1/appointments/" + code + "/reschedule",
				"{\"slotId\":\"%s\"}".formatted(slotB), token);
		assertThat(moved.getResponse().getStatus()).isEqualTo(200);
		assertThat(json(moved).get("code").asText()).isEqualTo(code);
		assertThat(json(moved).get("previousStartsAt").asText()).endsWith("-03:00");
		assertThat(json(moved).get("previousEndsAt").asText()).endsWith("-03:00");
		assertThat(slotAvailable("PROFESSOR", rafaelId, slotA, token)).isTrue();
		assertThat(slotAvailable("PROFESSOR", rafaelId, slotB, token)).isFalse();

		// Cancelar libera o horario
		MvcResult cancelled = post("/api/v1/appointments/" + code + "/cancel", null, token);
		assertThat(cancelled.getResponse().getStatus()).isEqualTo(200);
		assertThat(json(cancelled).get("status").asText()).isEqualTo("CANCELLED");
		assertThat(json(cancelled).get("editable").asBoolean()).isFalse();
		assertThat(slotAvailable("PROFESSOR", rafaelId, slotB, token)).isTrue();

		// Cancelar de novo
		MvcResult again = post("/api/v1/appointments/" + code + "/cancel", null, token);
		assertThat(again.getResponse().getStatus()).isEqualTo(409);
		assertThat(json(again).get("code").asText()).isEqualTo("APPOINTMENT_ALREADY_CANCELLED");

		// Reagendar um cancelado tambem e recusado
		MvcResult resched = post("/api/v1/appointments/" + code + "/reschedule",
				"{\"slotId\":\"%s\"}".formatted(slotA), token);
		assertThat(resched.getResponse().getStatus()).isEqualTo(409);
		assertThat(json(resched).get("code").asText()).isEqualTo("APPOINTMENT_ALREADY_CANCELLED");
	}

	@Test
	void appointmentsOfAnotherStudentAreNotFound() throws Exception {
		String demoToken = login(DEMO_EMAIL, DEMO_PASSWORD);
		MvcResult other = post("/api/v1/auth/register", registerBody("outra.aluna@ucsal.edu.br"), null);
		String otherToken = json(other).get("token").asText();

		String craSlot = availableSlots("CRA", null, demoToken).get(0).get("id").asText();
		MvcResult created = post("/api/v1/appointments", "{\"slotId\":\"%s\"}".formatted(craSlot), demoToken);
		assertThat(created.getResponse().getStatus()).isEqualTo(201);
		assertThat(json(created).get("professional").isNull()).isTrue();
		String code = json(created).get("code").asText();

		MvcResult read = get("/api/v1/appointments/" + code, otherToken);
		assertThat(read.getResponse().getStatus()).isEqualTo(404);
		assertThat(json(read).get("code").asText()).isEqualTo("NOT_FOUND");

		MvcResult cancel = post("/api/v1/appointments/" + code + "/cancel", null, otherToken);
		assertThat(cancel.getResponse().getStatus()).isEqualTo(404);

		assertThat(json(get("/api/v1/appointments/me", otherToken)).toString()).doesNotContain(code);
	}

	@Test
	void protectedRoutesRequireBearerToken() throws Exception {
		MvcResult r = get("/api/v1/appointments/me", null);
		assertThat(r.getResponse().getStatus()).isEqualTo(401);
		assertThat(json(r).get("code").asText()).isEqualTo("UNAUTHORIZED");
	}

	@Test
	void unknownRouteAnswersWithErrorEnvelope() throws Exception {
		MvcResult r = get("/api/v1/nao-existe", login(DEMO_EMAIL, DEMO_PASSWORD));
		assertThat(r.getResponse().getStatus()).isEqualTo(404);
		assertThat(json(r).get("code").asText()).isEqualTo("NOT_FOUND");
	}

	// ---- helpers ----

	private String login(String email, String password) throws Exception {
		MvcResult r = post("/api/v1/auth/login", "{\"email\":\"%s\",\"password\":\"%s\"}".formatted(email, password),
				null);
		assertThat(r.getResponse().getStatus()).isEqualTo(200);
		return json(r).get("token").asText();
	}

	private String professionalId(String name, String token) throws Exception {
		for (String type : List.of("PROFESSOR", "COORDINATION")) {
			for (JsonNode p : json(get("/api/v1/professionals?type=" + type, token))) {
				if (p.get("name").asText().equals(name)) {
					return p.get("id").asText();
				}
			}
		}
		throw new AssertionError("Profissional não encontrado: " + name);
	}

	private List<JsonNode> availableSlots(String type, String professionalId, String token) throws Exception {
		String path = "/api/v1/slots?type=" + type + (professionalId == null ? "" : "&professionalId=" + professionalId);
		List<JsonNode> result = new ArrayList<>();
		for (JsonNode s : json(get(path, token))) {
			if (s.get("available").asBoolean()) {
				result.add(s);
			}
		}
		return result;
	}

	private boolean slotAvailable(String type, String professionalId, String slotId, String token) throws Exception {
		JsonNode all = json(get("/api/v1/slots?type=" + type + "&professionalId=" + professionalId, token));
		for (JsonNode s : all) {
			if (s.get("id").asText().equals(slotId)) {
				return s.get("available").asBoolean();
			}
		}
		throw new AssertionError("Horário fora da janela: " + slotId);
	}

	private static boolean hasSlots(JsonNode professors, String name) {
		for (JsonNode p : professors) {
			if (p.get("name").asText().equals(name)) {
				return p.get("hasSlots").asBoolean();
			}
		}
		throw new AssertionError("Profissional não encontrado: " + name);
	}

	private static boolean teaches(JsonNode professionals, String name) {
		for (JsonNode p : professionals) {
			if (p.get("name").asText().equals(name)) {
				return p.get("teaches").asBoolean();
			}
		}
		throw new AssertionError("Profissional não encontrado: " + name);
	}

	private static String registerBody(String email) {
		return ("{\"fullName\":\"Ana Souza\",\"enrollment\":\"20261001\",\"courseCode\":\"ADM\",\"email\":\"%s\","
				+ "\"password\":\"senha-forte-123\"}").formatted(email);
	}

	private MvcResult get(String path, String token) throws Exception {
		MockHttpServletRequestBuilder req = MockMvcRequestBuilders.get(path);
		return mvc.perform(withToken(req, token)).andReturn();
	}

	private MvcResult post(String path, String body, String token) throws Exception {
		MockHttpServletRequestBuilder req = MockMvcRequestBuilders.post(path).contentType(MediaType.APPLICATION_JSON);
		if (body != null) {
			req = req.content(body);
		}
		return mvc.perform(withToken(req, token)).andReturn();
	}

	private static MockHttpServletRequestBuilder withToken(MockHttpServletRequestBuilder req, String token) {
		return token == null ? req : req.header("Authorization", "Bearer " + token);
	}

	private static JsonNode json(MvcResult r) throws Exception {
		return JSON.readTree(r.getResponse().getContentAsString());
	}
}
