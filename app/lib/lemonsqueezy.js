const LEMONSQUEEZY_API_URL = 'https://api.lemonsqueezy.com/v1';

export const PLAN_VARIANTS = {
  peregrino: process.env.NEXT_PUBLIC_LS_VARIANT_PEREGRINO,
  discipulo: process.env.NEXT_PUBLIC_LS_VARIANT_DISCIPULO,
  claraval: process.env.NEXT_PUBLIC_LS_VARIANT_CLARAVAL,
};

export const PLAN_DETAILS = {
  free: {
    name: 'Gratuito',
    price: 0,
    features: ['Evangelio del dia', 'Lecturas del dia', 'Santo del dia', 'Liturgia de las Horas', 'Rosario del dia', 'Coronilla de la Divina Misericordia'],
  },
  peregrino: {
    name: 'Peregrino',
    price: 1.99,
    variantId: process.env.NEXT_PUBLIC_LS_VARIANT_PEREGRINO,
    features: ['Todo lo gratuito', 'Reflexion del Evangelio', '1 Journal espiritual'],
  },
  discipulo: {
    name: 'Discipulo',
    price: 3.99,
    variantId: process.env.NEXT_PUBLIC_LS_VARIANT_DISCIPULO,
    features: ['Todo lo de Peregrino', '3 Journals espirituales'],
  },
  claraval: {
    name: 'Claraval',
    price: 5.99,
    variantId: process.env.NEXT_PUBLIC_LS_VARIANT_CLARAVAL,
    features: ['Todo lo de Discipulo', 'Todos los Journals (9+)', 'Contenido exclusivo', 'Acceso anticipado a novedades'],
  },
};

export async function createCheckout({ variantId, userEmail, userId }) {
  const response = await fetch(`${LEMONSQUEEZY_API_URL}/checkouts`, {
    method: 'POST',
    headers: {
      'Accept': 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
      'Authorization': `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
    },
    body: JSON.stringify({
      data: {
        type: 'checkouts',
        attributes: {
          checkout_options: { embed: false, media: false, button_color: '#782F40' },
          checkout_data: { email: userEmail, custom: { user_id: userId } },
          product_options: {
            enabled_variants: [parseInt(variantId)],
            redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/?checkout=success`,
            receipt_button_text: 'Volver a Little Claraval',
            receipt_thank_you_note: 'Gracias por unirte a Little Claraval! Que Dios te bendiga.',
          },
        },
        relationships: {
          store: { data: { type: 'stores', id: process.env.LEMONSQUEEZY_STORE_ID } },
          variant: { data: { type: 'variants', id: String(variantId) } },
        },
      },
    }),
  });
  const data = await response.json();
  if (!response.ok) {
    console.error('LemonSqueezy checkout error:', data);
    throw new Error('Error al crear el checkout');
  }
  return data.data.attributes.url;
}

export function variantToTier(variantId) {
  const id = String(variantId);
  if (id === String(PLAN_VARIANTS.peregrino)) return 'peregrino';
  if (id === String(PLAN_VARIANTS.discipulo)) return 'discipulo';
  if (id === String(PLAN_VARIANTS.claraval)) return 'claraval';
  return 'free';
}
