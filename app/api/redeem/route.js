import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const authHeader = request.headers.get('Authorization') || '';
    const token = authHeader.replace('Bearer ', '').trim();
    if (!token) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const body = await request.json();
    const code = body.code;
    if (!code) {
      return NextResponse.json({ error: 'Codigo requerido' }, { status: 400 });
    }

    // Cliente con anon key + JWT del usuario: auth.uid() se resuelve dentro del RPC.
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    const { data, error } = await supabase.rpc('redeem_code', { p_code: code });

    if (error) {
      console.error('Redeem RPC error:', error);
      // JWT vencido/invalido -> PostgREST devuelve error de auth
      const status = error.code === 'PGRST301' || error.status === 401 ? 401 : 500;
      return NextResponse.json(
        { error: status === 401 ? 'No autenticado' : 'Error interno' },
        { status }
      );
    }

    if (data && data.error) {
      return NextResponse.json({ error: data.error }, { status: data.status || 400 });
    }

    const message = data.lifetime
      ? `Codigo redimido! Tienes acceso ${data.tier} de por vida.`
      : `Codigo redimido! Tienes acceso ${data.tier} por ${data.duration_days} dias.`;

    return NextResponse.json({
      success: true,
      tier: data.tier,
      expires_at: data.expires_at,
      message,
    });
  } catch (error) {
    console.error('Redeem error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
