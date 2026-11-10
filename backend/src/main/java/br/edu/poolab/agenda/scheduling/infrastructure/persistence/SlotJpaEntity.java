package br.edu.poolab.agenda.scheduling.infrastructure.persistence;

import br.edu.poolab.agenda.shared.kernel.AttendanceType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "slots")
public class SlotJpaEntity {

	@Id
	private UUID id;

	@Enumerated(EnumType.STRING)
	@Column(name = "attendance_type", nullable = false)
	private AttendanceType attendanceType;

	@Column(name = "professional_id")
	private UUID professionalId;

	@Column(name = "starts_at", nullable = false)
	private Instant startsAt;

	@Column(name = "ends_at", nullable = false)
	private Instant endsAt;

	protected SlotJpaEntity() {
	}

	public SlotJpaEntity(UUID id, AttendanceType attendanceType, UUID professionalId, Instant startsAt,
			Instant endsAt) {
		this.id = id;
		this.attendanceType = attendanceType;
		this.professionalId = professionalId;
		this.startsAt = startsAt;
		this.endsAt = endsAt;
	}

	public UUID getId() {
		return id;
	}

	public AttendanceType getAttendanceType() {
		return attendanceType;
	}

	public UUID getProfessionalId() {
		return professionalId;
	}

	public Instant getStartsAt() {
		return startsAt;
	}

	public Instant getEndsAt() {
		return endsAt;
	}
}
