/** Código do agendamento em destaque (AGD-AAAA-NNN). */
export function ConfirmationCode({ code, label }: { code: string; label: string }) {
  return (
    <div className="w-full rounded-2xl border-2 border-primary bg-card px-6 py-4 text-center shadow-sm">
      <p className="text-[13px] text-muted-foreground">{label}</p>
      <p className="font-mono text-[28px] font-medium tracking-[0.06em] text-foreground md:text-[38px]">{code}</p>
    </div>
  )
}
