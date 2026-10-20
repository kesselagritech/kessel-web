// lib/paiement.ts — Aiguillage commun CamPay / CamerPay / NOKASH — [camerpay-carte v1 + nokash v1]
// Serveur uniquement. Chaque achat porte son prestataire dans document_purchases.payment_method :
// on revérifie toujours auprès du BON prestataire.

import type { SupabaseClient } from '@supabase/supabase-js'
import { confirmPurchase as confirmCampay } from '@/lib/campay'
import { confirmCardPurchase } from '@/lib/camerpay'
import { confirmNokashPurchase } from '@/lib/nokash'

export type ConfirmResult = 'completed' | 'failed' | 'pending'

/** Revérifie un achat auprès de son prestataire (CamPay, CamerPay ou NOKASH). */
export async function confirmAnyPurchase(
  supabase: SupabaseClient,
  purchaseId: string
): Promise<ConfirmResult> {
  const { data } = await supabase
    .from('document_purchases')
    .select('payment_method')
    .eq('id', purchaseId)
    .maybeSingle()

  if (data?.payment_method === 'nokash') return confirmNokashPurchase(supabase, purchaseId)
  if (data?.payment_method === 'camerpay') return confirmCardPurchase(supabase, purchaseId)
  if (data?.payment_method === 'campay') return confirmCampay(supabase, purchaseId)
  return 'pending'
}

/**
 * Avant une nouvelle tentative d'achat : solde les anciennes tentatives « pending » du même
 * document. On NE les supprime PAS à l'aveugle : un paiement peut être validé en retard
 * (Orange Money #150*50#, carte en vérification 3-D Secure). On redemande d'abord au
 * prestataire. Renvoie true si l'une a finalement réussi (document déjà acheté → pas de
 * double débit) ; sinon les classe « failed » (trace conservée, rattrapable).
 */
export async function solderTentativesEnAttente(
  supabase: SupabaseClient,
  userId: string,
  documentId: string
): Promise<boolean> {
  const { data: olds } = await supabase
    .from('document_purchases')
    .select('id')
    .eq('user_id', userId)
    .eq('document_id', documentId)
    .eq('payment_status', 'pending')

  for (const old of olds || []) {
    const r = await confirmAnyPurchase(supabase, old.id)
    if (r === 'completed') return true
    await supabase
      .from('document_purchases')
      .update({ payment_status: 'failed' })
      .eq('id', old.id)
      .eq('payment_status', 'pending')
  }
  return false
}
