package br.edu.poolab.agenda.scheduling.infrastructure.persistence;

import br.edu.poolab.agenda.scheduling.domain.model.AppointmentStatus;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

interface AppointmentJpaRepository extends JpaRepository<AppointmentJpaEntity, UUID> {

	Optional<AppointmentJpaEntity> findByCodeAndStudentId(String code, UUID studentId);

	List<AppointmentJpaEntity> findByStudentId(UUID studentId);

	@Query("select a.slotId from AppointmentJpaEntity a where a.slotId in :slotIds and a.status = :status")
	List<UUID> findSlotIdsWithStatus(@Param("slotIds") Collection<UUID> slotIds,
			@Param("status") AppointmentStatus status);
}
