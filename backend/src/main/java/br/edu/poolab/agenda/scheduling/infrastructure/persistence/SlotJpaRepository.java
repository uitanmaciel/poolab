package br.edu.poolab.agenda.scheduling.infrastructure.persistence;

import br.edu.poolab.agenda.shared.kernel.AttendanceType;
import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

interface SlotJpaRepository extends JpaRepository<SlotJpaEntity, UUID> {

	@Query("""
			select s from SlotJpaEntity s
			where s.attendanceType = :type and s.professionalId = :responsibleId
			  and s.startsAt > :from and s.startsAt <= :until
			order by s.startsAt""")
	List<SlotJpaEntity> findWindowForResponsible(@Param("type") AttendanceType type,
			@Param("responsibleId") UUID responsibleId, @Param("from") Instant from, @Param("until") Instant until);

	@Query("""
			select s from SlotJpaEntity s
			where s.attendanceType = :type and s.professionalId is null
			  and s.startsAt > :from and s.startsAt <= :until
			order by s.startsAt""")
	List<SlotJpaEntity> findWindowWithoutResponsible(@Param("type") AttendanceType type,
			@Param("from") Instant from, @Param("until") Instant until);

	@Query("""
			select s from SlotJpaEntity s
			where s.attendanceType = :type and s.professionalId in :responsibleIds
			  and s.startsAt > :from and s.startsAt <= :until
			order by s.startsAt""")
	List<SlotJpaEntity> findWindowForResponsibles(@Param("type") AttendanceType type,
			@Param("responsibleIds") Collection<UUID> responsibleIds,
			@Param("from") Instant from, @Param("until") Instant until);
}
