import { FormField } from '@/components/FormField'
import { Textarea } from '@/components/ui/textarea'
import { REASON_MAX_LENGTH, reasonLength } from '../model/reason'

interface ReasonFieldProps {
  value: string
  onChange: (value: string) => void
}

/** RF-08: motivo opcional com contador. Acima do limite o erro aparece e a revisão não avança. */
export function ReasonField({ value, onChange }: ReasonFieldProps) {
  const length = reasonLength(value)
  const over = length > REASON_MAX_LENGTH
  const counter = `${length} / ${REASON_MAX_LENGTH} caracteres`

  return (
    <FormField
      id="motivo"
      label="Motivo do atendimento"
      optional
      error={over ? `Reduza o texto em ${length - REASON_MAX_LENGTH} caractere(s).` : undefined}
    >
      <Textarea
        id="motivo"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        maxLength={REASON_MAX_LENGTH + 50}
        rows={6}
        placeholder="Descreva em uma frase o que você quer tratar"
        aria-invalid={over || undefined}
        aria-describedby="motivo-counter motivo-error"
        className="min-h-[150px] resize-none text-[15px]"
      />
      <div id="motivo-counter" className="flex justify-between text-[13px] text-muted-foreground">
        <span>Evite dados pessoais sensíveis.</span>
        <span className={over ? 'font-semibold text-error' : undefined}>{counter}</span>
      </div>
    </FormField>
  )
}
