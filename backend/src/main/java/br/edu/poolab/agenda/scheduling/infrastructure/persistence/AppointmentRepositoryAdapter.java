package br.edu.poolab.agenda.scheduling.infrastructure.persistence;

import br.edu.poolab.agenda.scheduling.domain.exception.SlotUnavailableException;
import br.edu.poolab.agenda.scheduling.domain.model.Appointment;
import br.edu.poolab.agenda.scheduling.domain.model.AppointmentCode;
import br.edu.poolab.agenda.scheduling.domain.model.AppointmentStatus;
import br.edu.poolab.agenda.scheduling.domain.model.Reason;
import br.edu.poolab.agenda.scheduling.domain.repository.AppointmentRepository;
import br.edu.poolab.agenda.shared.infrastructure.persistence.ConstraintViolations;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Repository;

@Repository
class AppointmentRepositoryAdapter implements AppointmentRepository {

	/** Indice unico parcial: um horario so pode ter um agendamento CONFIRMED. */
	static final String ACTIVE_SLOT_CONSTRAINT = "ux_appointments_active_slot";

	private final AppointmentJpaRepository jpa;

	AppointmentRepositoryAdapter(AppointmentJpaRepository jpa) {
		this.jpa = jpa;
	}

	@Override
	public Appointment save(Appointment a) {
		try {
			jpa.saveAndFlush(new AppointmentJpaEntity(a.id(), a.code().value(), a.studentId(), a.slotId(), a.type(),
					a.professionalId(), a.startsAt(), a.endsAt(), a.reason().map(Reason::value).orElse(null),
					a.persistedStatus(), a.createdAt()));
			return a;
		} catch (DataIntegrityViolationException e) {
			if (ConstraintViolations.violates(e, ACTIVE_SLOT_CONSTRAINT)) {
				throw new SlotUnavailableException();
			}
			throw e;
		}
	}

	@Override
	public Optional<Appointment> findByCodeAndStudentId(String code, UUID studentId) {
		return jpa.findByCodeAndStudentId(code, studentId).map(AppointmentRepositoryAdapter::toDomain);
	}

	@Override
	public List<Appointment> findByStudentId(UUID studentId) {
		return jpa.findByStudentId(studentId).stream().map(AppointmentRepositoryAdapter::toDomain).toList();
	}

	@Override
	public Set<UUID> findOccupiedSlotIds(Collection<UUID> slotIds) {
		if (slotIds.isEmpty()) {
			return Set.of();
		}
		return Set.copyOf(jpa.findSlotIdsWithStatus(slotIds, AppointmentStatus.CONFIRMED));
	}

	private static Appointment toDomain(AppointmentJpaEntity e) {
		return Appointment.restore(e.getId(), AppointmentCode.restore(e.getCode()), e.getStudentId(),
				e.getReason() == null ? null : Reason.restore(e.getReason()),
				e.getCreatedAt(), e.getSlotId(), e.getAttendanceType(), e.getProfessionalId(), e.getStartsAt(),
				e.getEndsAt(), e.getStatus());
	}
}
