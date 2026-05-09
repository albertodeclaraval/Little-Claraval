import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

function getSupabaseAdmin() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export async function POST(request) {
  try {
    const { code, userId } = await request.json();
    if (!code || !userId) {
      return NextResponse.json({ error: 'Codigo y usuario requeridos' }, { status: 400 });
    }
    const supabase = getSupabaseAdmin();
    const { data: promoCode, error: codeError } = await supabase
      .from('promo_codes').select('*').eq('code', code.trim().toUpperCase()).single();
    if (codeError || !promoCode) {
      return NextResponse.json({ error: 'Codigo no valido' }, { status: 404 });
    }
    if (promoCode.expires_at && new Date(promoCode.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Este codigo ha expirado' }, { status: 400 });
    }
    if (promoCode.current_redemptions >= promoCode.max_redemptions) {
      return NextResponse.json({ error: 'Este codigo ya alcanzo su limite de usos' }, { status: 400 });
    }
    const { data: existingRedemption } = await supabase
      .from('promo_redemptions').select('id').eq('code_id', promoCode.id).eq('user_id', userId).single();
    if (existingRedemption) {
      return NextResponse.json({ error: 'Ya usaste este codigo' }, { status: 400 });
    }
    const accessExpiresAt = new Date();
    accessExpiresAt.setDate(accessExpiresAt.getDate() + promoCode.duration_days);
    await supabase.from('promo_redemptions').insert({
      code_id: promoCode.id, user_id: userId, access_expires_at: accessExpiresAt.toISOString(),
    });
    await supabase.from('promo_codes').update({ current_redemptions: promoCode.current_redemptions + 1 }).eq('id', promoCode.id);
    const { data: profile } = await supabase.from('profiles').select('gift_tier, gift_expires_at').eq('id', userId).single();
    const TIER_LEVELS = { free: 0, peregrino: 1, discipulo: 2, claraval: 3 };
    const currentGiftLevel = TIER_LEVELS[profile?.gift_tier] || 0;
    const newGiftLevel = TIER_LEVELS[promoCode.tier] || 0;
    const currentExpiry = profile?.gift_expires_at ? new Date(profile.gift_expires_at) : new Date(0);
    if (newGiftLevel > currentGiftLevel || accessExpiresAt > currentExpiry) {
      await supabase.from('profiles').update({
        gift_tier: promoCode.tier, gift_expires_at: accessExpiresAt.toISOString(),
      }).eq('id', userId);
    }
    return NextResponse.json({
      success: true, tier: promoCode.tier, expires_at: accessExpiresAt.toISOString(),
      message: 'Codigo redimido! Tienes acceso ' + promoCode.tier + ' por ' + promoCode.duration_days + ' dias.',
    });
  } catch (error) {
    console.error('Redeem error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
