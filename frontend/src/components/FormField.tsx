import { CircleAlert } from 'lucide-react'
import type { ReactNode } from 'react'
import { Label } from '@/components/ui/label'

interface FormFieldProps {
  id: string
  label: string
  error?: string
  hint?: string
  optional?: boolean
  children: ReactNode
}

/** Rótulo, controle e mensagem de erro/ajuda ligados por id (aria-describedby é passado ao controle). */
export function FormField({ id, label, error, hint, optional, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} className="text-sm font-semibold">
        {label}
        {optional ? <span className="ml-2 rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold text-muted-foreground">opcional</span> : null}
      </Label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="flex items-start gap-1.5 text-[13px] font-medium text-error">
          <CircleAlert aria-hidden="true" className="mt-0.5 size-3.5 flex-none" />
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-[13px] text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
