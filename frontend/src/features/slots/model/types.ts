/** Espelha docs/api.md > GET /slots. */
export interface SlotDto {
  id: string
  startsAt: string
  endsAt: string
  available: boolean
}

/** Modelo de apresentação: datas já convertidas. */
export interface Slot {
  id: string
  startsAt: Date
  endsAt: Date
  available: boolean
}

export function toSlot(dto: SlotDto): Slot {
  return {
    id: dto.id,
    startsAt: new Date(dto.startsAt),
    endsAt: new Date(dto.endsAt),
    available: dto.available,
  }
}
