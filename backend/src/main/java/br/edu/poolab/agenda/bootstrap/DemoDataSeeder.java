package br.edu.poolab.agenda.bootstrap;

import br.edu.poolab.agenda.catalog.domain.model.Course;
import br.edu.poolab.agenda.catalog.domain.model.Professional;
import br.edu.poolab.agenda.catalog.domain.model.ProfessorRole;
import br.edu.poolab.agenda.catalog.domain.repository.CourseRepository;
import br.edu.poolab.agenda.catalog.domain.repository.ProfessionalRepository;
import br.edu.poolab.agenda.identity.application.RegisterStudentCommand;
import br.edu.poolab.agenda.identity.application.RegisterStudentHandler;
import br.edu.poolab.agenda.scheduling.domain.model.Slot;
import br.edu.poolab.agenda.scheduling.domain.repository.SlotRepository;
import br.edu.poolab.agenda.shared.kernel.AgendaTimeZone;
import br.edu.poolab.agenda.shared.kernel.AttendanceType;
import java.time.Clock;
import java.time.DayOfWeek;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Recria os dados demonstrativos a cada boot (PRD 4.11.1 com a decisao do usuario de usar PostgreSQL).
 * Composition root: usa as interfaces de repositorio do dominio e, para a conta demo, o handle de cadastro.
 * Dados sinteticos; a senha vem de DEMO_PASSWORD (.env), nunca do codigo.
 */
@Component
class DemoDataSeeder implements ApplicationRunner {

	private static final Logger log = LoggerFactory.getLogger(DemoDataSeeder.class);
	private static final String DEMO_EMAIL = "demo.aluna@ucsal.edu.br";
	private static final List<LocalTime> SLOT_START_TIMES = List.of(
			LocalTime.of(9, 0), LocalTime.of(9, 30), LocalTime.of(10, 0), LocalTime.of(10, 30),
			LocalTime.of(11, 0), LocalTime.of(11, 30),
			LocalTime.of(14, 0), LocalTime.of(14, 30), LocalTime.of(15, 0), LocalTime.of(15, 30),
			LocalTime.of(16, 0), LocalTime.of(16, 30));

	private final JdbcTemplate jdbc;
	private final CourseRepository courses;
	private final ProfessionalRepository professionals;
	private final SlotRepository slots;
	private final RegisterStudentHandler registerStudent;
	private final Clock clock;
	private final String demoPassword;

	DemoDataSeeder(JdbcTemplate jdbc, CourseRepository courses, ProfessionalRepository professionals,
			SlotRepository slots, RegisterStudentHandler registerStudent, Clock clock,
			@Value("${app.demo.password}") String demoPassword) {
		this.jdbc = jdbc;
		this.courses = courses;
		this.professionals = professionals;
		this.slots = slots;
		this.registerStudent = registerStudent;
		this.clock = clock;
		this.demoPassword = demoPassword;
	}

	@Override
	@Transactional
	public void run(ApplicationArguments args) {
		if (demoPassword == null || demoPassword.length() < 8 || demoPassword.length() > 72) {
			throw new IllegalStateException("DEMO_PASSWORD deve ter entre 8 e 72 caracteres (ver backend/.env).");
		}
		jdbc.execute("TRUNCATE TABLE appointments, slots, students, professionals, courses, appointment_sequences"
				+ " CASCADE");

		courses.save(Course.create("ADM", "Administração"));
		courses.save(Course.create("ENG", "Engenharia"));
		courses.save(Course.create("DIR", "Direito"));

		Professional rafael = professionals.save(
				Professional.create(UUID.randomUUID(), "Prof. Rafael Cardoso", ProfessorRole.PROFESSOR, null, true));
		// Sem horarios de proposito: exercita hasSlots = false (RF-07).
		professionals.save(Professional.create(UUID.randomUUID(), "Profa. Marina Seixas", ProfessorRole.PROFESSOR,
				null, true));
		// Tania leciona e coordena: horarios PROFESSOR e COORDINATION.
		Professional tania = professionals.save(
				Professional.create(UUID.randomUUID(), "Profa. Tânia Lima", ProfessorRole.COORDINATOR, "ADM", true));
		// Heitor so coordena: horarios apenas COORDINATION e fora da lista de professores.
		Professional heitor = professionals.save(
				Professional.create(UUID.randomUUID(), "Prof. Heitor Mendes", ProfessorRole.COORDINATOR, "ENG", false));

		List<Slot> created = seedSlots(rafael.id(), tania.id(), heitor.id());
		slots.saveAll(created);

		registerStudent.handle(new RegisterStudentCommand("Aluna Demonstração", "20260001", "ADM", DEMO_EMAIL,
				demoPassword));

		log.info("Dados demonstrativos recriados: 3 cursos, 4 profissionais, {} horários, conta demo.",
				created.size());
	}

	/** Dias uteis dentro da janela de 14 dias (slots fora da janela nao sao visiveis na API). */
	private List<Slot> seedSlots(UUID rafaelId, UUID taniaId, UUID heitorId) {
		Instant now = clock.instant();
		LocalDate today = now.atZone(AgendaTimeZone.ZONE).toLocalDate();
		LocalDate lastDay = now.plus(Slot.BOOKING_WINDOW).atZone(AgendaTimeZone.ZONE).toLocalDate();
		List<Slot> result = new ArrayList<>();
		for (LocalDate day = today; !day.isAfter(lastDay); day = day.plusDays(1)) {
			if (day.getDayOfWeek() == DayOfWeek.SATURDAY || day.getDayOfWeek() == DayOfWeek.SUNDAY) {
				continue;
			}
			for (LocalTime time : SLOT_START_TIMES) {
				Instant start = day.atTime(time).atZone(AgendaTimeZone.ZONE).toInstant();
				Slot probe = Slot.create(UUID.randomUUID(), AttendanceType.PROFESSOR, rafaelId, start);
				if (!probe.isBookableAt(now)) {
					continue;
				}
				result.add(probe);
				// Tania tambem coordena: horarios do tipo PROFESSOR e COORDINATION.
				result.add(Slot.create(UUID.randomUUID(), AttendanceType.PROFESSOR, taniaId, start));
				result.add(Slot.create(UUID.randomUUID(), AttendanceType.COORDINATION, taniaId, start));
				result.add(Slot.create(UUID.randomUUID(), AttendanceType.COORDINATION, heitorId, start));
				result.add(Slot.create(UUID.randomUUID(), AttendanceType.CRA, null, start));
			}
		}
		return result;
	}
}
