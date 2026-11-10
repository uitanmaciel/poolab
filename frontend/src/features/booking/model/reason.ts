/** RF-08: motivo opcional, até 255 caracteres. */
export const REASON_MAX_LENGTH = 255

/** Contagem pelo tamanho da string (UTF-16), a mesma base de `String.length` do servidor Java. */
export function reasonLength(text: string): number {
  return text.length
}

export function isReasonValid(text: string): boolean {
  return reasonLength(text) <= REASON_MAX_LENGTH
}

/** Vazio ou só espaços vira null, como pede o contrato. */
export function toReasonPayload(text: string): string | null {
  const trimmed = text.trim()
  return trimmed.length === 0 ? null : trimmed
}
