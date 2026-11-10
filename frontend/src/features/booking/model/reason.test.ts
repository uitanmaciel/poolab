import { describe, expect, it } from 'vitest'
import { REASON_MAX_LENGTH, isReasonValid, reasonLength, toReasonPayload } from './reason'

describe('motivo do atendimento (RF-08)', () => {
  it('conta caracteres até o limite de 255', () => {
    expect(REASON_MAX_LENGTH).toBe(255)
    expect(reasonLength('abc')).toBe(3)
    expect(isReasonValid('a'.repeat(255))).toBe(true)
    expect(isReasonValid('a'.repeat(256))).toBe(false)
  })

  it('envia null quando vazio ou só com espaços', () => {
    expect(toReasonPayload('')).toBeNull()
    expect(toReasonPayload('   ')).toBeNull()
    expect(toReasonPayload('  Dúvida sobre a prova  ')).toBe('Dúvida sobre a prova')
  })
})
