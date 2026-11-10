CREATE TABLE courses (
    code  varchar(10)  PRIMARY KEY,
    name  varchar(120) NOT NULL
);

CREATE TABLE professionals (
    id          uuid         PRIMARY KEY,
    name        varchar(120) NOT NULL,
    role        varchar(20)  NOT NULL CHECK (role IN ('PROFESSOR', 'COORDINATOR')),
    course_code varchar(10)  REFERENCES courses (code),
    CONSTRAINT ck_professionals_coordinator_course CHECK (role <> 'COORDINATOR' OR course_code IS NOT NULL),
    CONSTRAINT ck_professionals_professor_no_course CHECK (role <> 'PROFESSOR' OR course_code IS NULL)
);

CREATE TABLE students (
    id            uuid         PRIMARY KEY,
    full_name     varchar(120) NOT NULL,
    enrollment    varchar(20)  NOT NULL,
    course_code   varchar(10)  NOT NULL REFERENCES courses (code),
    email         varchar(254) NOT NULL,
    password_hash varchar(100) NOT NULL,
    CONSTRAINT uk_students_email UNIQUE (email)
);

CREATE TABLE slots (
    id              uuid        PRIMARY KEY,
    attendance_type varchar(20) NOT NULL CHECK (attendance_type IN ('COORDINATION', 'PROFESSOR', 'CRA')),
    professional_id uuid        REFERENCES professionals (id),
    starts_at       timestamptz NOT NULL,
    ends_at         timestamptz NOT NULL,
    CONSTRAINT ck_slots_duration CHECK (ends_at = starts_at + interval '30 minutes'),
    CONSTRAINT ck_slots_responsible CHECK ((attendance_type = 'CRA') = (professional_id IS NULL))
);

CREATE INDEX ix_slots_type_responsible_start ON slots (attendance_type, professional_id, starts_at);

CREATE TABLE appointments (
    id              uuid         PRIMARY KEY,
    code            varchar(20)  NOT NULL,
    student_id      uuid         NOT NULL REFERENCES students (id),
    slot_id         uuid         NOT NULL REFERENCES slots (id),
    attendance_type varchar(20)  NOT NULL CHECK (attendance_type IN ('COORDINATION', 'PROFESSOR', 'CRA')),
    professional_id uuid         REFERENCES professionals (id),
    starts_at       timestamptz  NOT NULL,
    ends_at         timestamptz  NOT NULL,
    reason          varchar(255),
    status          varchar(20)  NOT NULL CHECK (status IN ('CONFIRMED', 'CANCELLED')),
    created_at      timestamptz  NOT NULL,
    CONSTRAINT uk_appointments_code UNIQUE (code)
);

-- Garantia contra dupla marcacao (RF-12): um horario tem no maximo um agendamento confirmado.
-- Cancelar libera o horario; reagendar troca slot_id na mesma linha, na mesma transacao.
CREATE UNIQUE INDEX ux_appointments_active_slot ON appointments (slot_id) WHERE status = 'CONFIRMED';

CREATE INDEX ix_appointments_student ON appointments (student_id, starts_at);

-- Contador do codigo AGD-AAAA-NNN, uma linha por ano.
CREATE TABLE appointment_sequences (
    year       integer PRIMARY KEY,
    last_value bigint  NOT NULL
);
