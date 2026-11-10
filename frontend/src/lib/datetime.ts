/**
 * Datas do domínio são exibidas no fuso de Salvador/São Paulo (-03:00, sem DST),
 * independentemente do fuso do navegador do usuário.
 */
export const APP_TIME_ZONE = 'America/Sao_Paulo'

const partsFormatter = (options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('pt-BR', { timeZone: APP_TIME_ZONE, ...options })

const dayKeyFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: APP_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})
const timeFormatter = partsFormatter({ hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
const weekdayFormatter = partsFormatter({ weekday: 'short' })
const dayNumberFormatter = partsFormatter({ day: 'numeric' })
const monthShortFormatter = partsFormatter({ month: 'short' })
const monthLongFormatter = partsFormatter({ month: 'long' })
const yearFormatter = partsFormatter({ year: 'numeric' })

/** Chave estável do dia no fuso do app: "2026-11-12". */
export function dayKey(date: Date): string {
  return dayKeyFormatter.format(date)
}

/** "10:00" */
export function formatTime(date: Date): string {
  return timeFormatter.format(date)
}

/** "qua" */
export function formatWeekday(date: Date): string {
  return weekdayFormatter.format(date).replace('.', '')
}

/** "12" */
export function formatDayNumber(date: Date): string {
  return dayNumberFormatter.format(date)
}

/** "nov" */
export function formatMonthShort(date: Date): string {
  return monthShortFormatter.format(date).replace('.', '')
}

/** "qua, 12 nov · 10:00" */
export function formatShortWhen(date: Date): string {
  return `${formatWeekday(date)}, ${formatDayNumber(date)} ${formatMonthShort(date)} · ${formatTime(date)}`
}

/** "qua, 12 nov 2026 · 10:00 a 10:30" */
export function formatAppointmentWhen(startsAt: Date, endsAt: Date): string {
  return `${formatWeekday(startsAt)}, ${formatDayNumber(startsAt)} ${formatMonthShort(startsAt)} ${yearFormatter.format(startsAt)} · ${formatTime(startsAt)} a ${formatTime(endsAt)}`
}

/** "qua, 12 de novembro de 2026" */
export function formatLongDate(date: Date): string {
  return `${formatWeekday(date)}, ${formatDayNumber(date)} de ${monthLongFormatter.format(date)} de ${yearFormatter.format(date)}`
}
