import { createCheckout, PLAN_VARIANTS } from '@/app/lib/lemonsqueezy';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { variantId, userId, userEmail } = await request.json();
    const validVariants = Object.values(PLAN_VARIANTS);
    if (!validVariants.includes(String(variantId))) {
      return NextResponse.json({ error: 'Plan no valido' }, { status: 400 });
    }
    if (!userId || !userEmail) {
      return NextResponse.json({ error: 'Usuario no autenticado' }, { status: 401 });
    }
    const checkoutUrl = await createCheckout({ variantId, userEmail, userId });
    return NextResponse.json({ checkoutUrl });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Error al crear el checkout' }, { status: 500 });
  }
}
