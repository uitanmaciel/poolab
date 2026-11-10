package br.edu.poolab.agenda.scheduling.infrastructure.persistence;

import br.edu.poolab.agenda.scheduling.domain.model.AppointmentStatus;
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
@Table(name = "appointments")
public class AppointmentJpaEntity {

	@Id
	private UUID id;

	@Column(nullable = false, unique = true)
	private String code;

	@Column(name = "student_id", nullable = false)
	private UUID studentId;

	@Column(name = "slot_id", nullable = false)
	private UUID slotId;

	@Enumerated(EnumType.STRING)
	@Column(name = "attendance_type", nullable = false)
	private AttendanceType attendanceType;

	@Column(name = "professional_id")
	private UUID professionalId;

	@Column(name = "starts_at", nullable = false)
	private Instant startsAt;

	@Column(name = "ends_at", nullable = false)
	private Instant endsAt;

	@Column(length = 255)
	private String reason;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private AppointmentStatus status;

	@Column(name = "created_at", nullable = false)
	private Instant createdAt;

	protected AppointmentJpaEntity() {
	}

	public AppointmentJpaEntity(UUID id, String code, UUID studentId, UUID slotId, AttendanceType attendanceType,
			UUID professionalId, Instant startsAt, Instant endsAt, String reason, AppointmentStatus status,
			Instant createdAt) {
		this.id = id;
		this.code = code;
		this.studentId = studentId;
		this.slotId = slotId;
		this.attendanceType = attendanceType;
		this.professionalId = professionalId;
		this.startsAt = startsAt;
		this.endsAt = endsAt;
		this.reason = reason;
		this.status = status;
		this.createdAt = createdAt;
	}

	public UUID getId() {
		return id;
	}

	public String getCode() {
		return code;
	}

	public UUID getStudentId() {
		return studentId;
	}

	public UUID getSlotId() {
		return slotId;
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

	public String getReason() {
		return reason;
	}

	public AppointmentStatus getStatus() {
		return status;
	}

	public Instant getCreatedAt() {
		return createdAt;
	}
}
