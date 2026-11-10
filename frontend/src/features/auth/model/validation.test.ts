import { describe, expect, it } from 'vitest'
import { isUcsalEmail, mapServerFieldErrors, validateRegister } from './validation'

const VALID = {
  fullName: 'Ana Souza',
  enrollment: '20261001',
  courseCode: 'ADM',
  email: 'ana@ucsal.edu.br',
  password: 'senha-forte-123',
}

describe('isUcsalEmail (RF-02, domínio do e-mail)', () => {
  it('aceita o domínio institucional, sem diferenciar maiúsculas', () => {
    expect(isUcsalEmail('ana@ucsal.edu.br')).toBe(true)
    expect(isUcsalEmail('  ANA@UCSAL.EDU.BR ')).toBe(true)
  })

  it('recusa outros domínios e domínios que apenas contêm o texto', () => {
    expect(isUcsalEmail('ana@gmail.com')).toBe(false)
    expect(isUcsalEmail('ana@ucsal.edu.br.evil.com')).toBe(false)
    expect(isUcsalEmail('ana@xucsal.edu.br')).toBe(false)
    expect(isUcsalEmail('@ucsal.edu.br')).toBe(false)
  })
})

describe('validateRegister', () => {
  it('não retorna erros para cadastro válido', () => {
    expect(validateRegister(VALID)).toEqual({})
  })

  it('mostra erro de domínio no campo de e-mail', () => {
    const errors = validateRegister({ ...VALID, email: 'ana@gmail.com' })
    expect(errors.email).toContain('@ucsal.edu.br')
  })

  it('aplica limites de matrícula e senha do contrato', () => {
    expect(validateRegister({ ...VALID, enrollment: '123' }).enrollment).toBeDefined()
    expect(validateRegister({ ...VALID, enrollment: '12a4' }).enrollment).toBeDefined()
    expect(validateRegister({ ...VALID, password: 'curta' }).password).toBeDefined()
    expect(validateRegister({ ...VALID, password: 'x'.repeat(73) }).password).toBeDefined()
  })
})

describe('mapServerFieldErrors', () => {
  it('mapeia detalhes de campo do servidor para o formulário', () => {
    const errors = mapServerFieldErrors([{ field: 'email', message: 'qualquer coisa' }])
    expect(errors.email).toContain('@ucsal.edu.br')
  })
})
