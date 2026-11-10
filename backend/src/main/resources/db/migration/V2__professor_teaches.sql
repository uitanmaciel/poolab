-- Leciona: possui horarios do tipo PROFESSOR. Coordenador pode ou nao lecionar.
ALTER TABLE professionals ADD COLUMN teaches boolean NOT NULL DEFAULT false;
UPDATE professionals SET teaches = true WHERE role = 'PROFESSOR';
