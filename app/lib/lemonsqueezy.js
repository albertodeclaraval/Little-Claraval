const LEMONSQUEEZY_API_URL = 'https://api.lemonsqueezy.com/v1';

export const PLAN_VARIANTS = {
  peregrino: process.env.NEXT_PUBLIC_LS_VARIANT_PEREGRINO,
  discipulo: process.env.NEXT_PUBLIC_LS_VARIANT_DISCIPULO,
  claraval: process.env.NEXT_PUBLIC_LS_VARIANT_CLARAVAL,
};

export async function createCheckout({ variantId, userEmail, userId }) {
  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  const storeId = process.env.LEMONSQUEEZY_STORE_ID;

  if (!apiKey) throw new Error('LEMONSQUEEZY_API_KEY not set');
  if (!storeId) throw new Error('LEMONSQUEEZY_STORE_ID not set');

  const body = {
    data: {
      type: 'checkouts',
      attributes: {
        checkout_options: { embed: false, media: false, button_color: '#782F40' },
        checkout_data: { email: userEmail, custom: { user_id: userId } },
        product_options: {
          enabled_variants: [parseInt(variantId)],
          redirect_url: (process.env.NEXT_PUBLIC_APP_URL || 'https://littleclaraval.com') + '/?checkout=success',
          receipt_button_text: 'Volver a Little Claraval',
          receipt_thank_you_note: 'Gracias por unirte a Little Claraval!',
        },
      },
      relationships: {
        store: { data: { type: 'stores', id: storeId } },
        variant: { data: { type: 'variants', id: String(variantId) } },
      },
    },
  };

  const response = await fetch(LEMONSQUEEZY_API_URL + '/checkouts', {
    method: 'POST',
    headers: {
      'Accept': 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
      'Authorization': 'Bearer ' + apiKey,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error('LemonSqueezy error: ' + JSON.stringify(data));
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
