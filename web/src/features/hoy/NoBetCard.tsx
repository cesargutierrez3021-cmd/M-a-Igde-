import { Card } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import type { NoBet } from '../../lib/types'

const motivoLegible: Record<string, string> = {
  SIN_CALIBRACION: 'Sin calibrador válido para este mercado',
  EDGE_INSUFICIENTE: 'El valor encontrado no supera el listón mínimo',
}

/*
 * NO BET con dignidad — manual §7.3 módulo 2 e invariante 10.
 * "Si no hay valor, no hay valor." No se esconde, no se rellena con relleno.
 */
export function NoBetCard({ noBet }: NoBetCardProps) {
  return (
    <Card className="border-dashed">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--text-primary)]">{noBet.mercado}</p>
          <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
            {motivoLegible[noBet.motivo] ?? noBet.motivo}
          </p>
        </div>
        <Badge tono="void">NO BET</Badge>
      </div>
    </Card>
  )
}

interface NoBetCardProps {
  noBet: NoBet
}
