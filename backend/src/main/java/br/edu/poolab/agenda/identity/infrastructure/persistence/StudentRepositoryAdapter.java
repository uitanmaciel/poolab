package br.edu.poolab.agenda.identity.infrastructure.persistence;

import br.edu.poolab.agenda.identity.domain.exception.EmailAlreadyRegisteredException;
import br.edu.poolab.agenda.identity.domain.model.Student;
import br.edu.poolab.agenda.identity.domain.model.UcsalEmail;
import br.edu.poolab.agenda.identity.domain.repository.StudentRepository;
import java.util.Optional;
import java.util.UUID;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Repository;

@Repository
class StudentRepositoryAdapter implements StudentRepository {

	private static final String EMAIL_CONSTRAINT = "uk_students_email";

	private final StudentJpaRepository jpa;

	StudentRepositoryAdapter(StudentJpaRepository jpa) {
		this.jpa = jpa;
	}

	@Override
	public Optional<Student> findById(UUID id) {
		return jpa.findById(id).map(StudentRepositoryAdapter::toDomain);
	}

	@Override
	public Optional<Student> findByEmail(UcsalEmail email) {
		return jpa.findByEmail(email.value()).map(StudentRepositoryAdapter::toDomain);
	}

	@Override
	public Student save(Student student) {
		try {
			StudentJpaEntity saved = jpa.saveAndFlush(new StudentJpaEntity(student.id(), student.fullName(),
					student.enrollment(), student.courseCode(), student.email().value(), student.passwordHash()));
			return toDomain(saved);
		} catch (DataIntegrityViolationException e) {
			if (violates(e, EMAIL_CONSTRAINT)) {
				throw new EmailAlreadyRegisteredException();
			}
			throw e;
		}
	}

	static boolean violates(DataIntegrityViolationException e, String constraint) {
		String message = e.getMostSpecificCause().getMessage();
		return message != null && message.contains(constraint);
	}

	private static Student toDomain(StudentJpaEntity e) {
		return Student.restore(e.getId(), e.getFullName(), e.getEnrollment(), e.getCourseCode(),
				UcsalEmail.of(e.getEmail()), e.getPasswordHash());
	}
}
