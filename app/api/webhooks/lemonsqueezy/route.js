import { createClient } from '@supabase/supabase-js';
import { variantToTier } from '@/app/lib/lemonsqueezy';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

function getSupabaseAdmin() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function verifyWebhookSignature(rawBody, signature) {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(rawBody).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

export async function POST(request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-signature');
    if (!signature || !verifyWebhookSignature(rawBody, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
    const payload = JSON.parse(rawBody);
    const eventName = payload.meta.event_name;
    const customData = payload.meta.custom_data;
    const subscriptionData = payload.data.attributes;
    const userId = customData?.user_id;
    if (!userId) {
      return NextResponse.json({ error: 'No user_id' }, { status: 400 });
    }
    const supabase = getSupabaseAdmin();
    const variantId = subscriptionData.variant_id;
    const tier = variantToTier(variantId);
    let subscriptionStatus = 'free';
    let subscriptionTier = 'free';
    if (eventName === 'subscription_created' || eventName === 'subscription_resumed') {
      subscriptionStatus = 'active';
      subscriptionTier = tier;
    } else if (eventName === 'subscription_updated') {
      if (subscriptionData.status === 'active') {
        subscriptionStatus = 'active';
        subscriptionTier = tier;
      } else if (subscriptionData.status === 'past_due') {
        subscriptionStatus = 'past_due';
        subscriptionTier = tier;
      } else if (subscriptionData.status === 'cancelled') {
        const endsAt = subscriptionData.ends_at;
        if (endsAt && new Date(endsAt) > new Date()) {
          subscriptionStatus = 'active';
          subscriptionTier = tier;
        } else {
          subscriptionStatus = 'cancelled';
          subscriptionTier = 'free';
        }
      }
    } else if (eventName === 'subscription_cancelled') {
      const endsAt = subscriptionData.ends_at;
      if (endsAt && new Date(endsAt) > new Date()) {
        subscriptionStatus = 'active';
        subscriptionTier = tier;
      } else {
        subscriptionStatus = 'cancelled';
        subscriptionTier = 'free';
      }
    } else if (eventName === 'subscription_expired') {
      subscriptionStatus = 'expired';
      subscriptionTier = 'free';
    }
    const { error } = await supabase.from('profiles').update({
      subscription_tier: subscriptionTier,
      subscription_status: subscriptionStatus,
      subscription_id: String(subscriptionData.id),
      lemon_customer_id: String(subscriptionData.customer_id),
    }).eq('id', userId);
    if (error) {
      console.error('Supabase update error:', error);
      return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
    }

    // Sincroniza entitlements al tier efectivo (recorta cupos en downgrade; no-op en upgrade).
    // No falla el webhook si esto falla: el perfil ya quedó actualizado.
    const { error: syncError } = await supabase.rpc('sync_tier_entitlements', { p_user_id: userId });
    if (syncError) {
      console.error('Entitlement sync error:', syncError);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
