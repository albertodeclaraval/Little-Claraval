const TIER_LEVELS = { free: 0, peregrino: 1, discipulo: 2, claraval: 3 };
const JOURNAL_LIMITS = { free: 0, peregrino: 1, discipulo: 3, claraval: 999 };

export function getEffectiveTier(profile) {
  const paidTier = profile.subscription_status === 'active' ? profile.subscription_tier : 'free';
  const giftTier = profile.gift_tier && profile.gift_expires_at && new Date(profile.gift_expires_at) > new Date() ? profile.gift_tier : 'free';
  const paidLevel = TIER_LEVELS[paidTier] || 0;
  const giftLevel = TIER_LEVELS[giftTier] || 0;
  return paidLevel >= giftLevel ? paidTier : giftTier;
}

export function canAccess(profile, requiredTier) {
  const effectiveTier = getEffectiveTier(profile);
  return (TIER_LEVELS[effectiveTier] || 0) >= (TIER_LEVELS[requiredTier] || 0);
}

export function canAccessJournal(profile, journalSlug, redeemedJournals = []) {
  if (redeemedJournals.includes(journalSlug)) return true;
  const effectiveTier = getEffectiveTier(profile);
  if (effectiveTier === 'claraval') return true;
  return (JOURNAL_LIMITS[effectiveTier] || 0) > 0;
}

export function getJournalLimit(profile) {
  const effectiveTier = getEffectiveTier(profile);
  return JOURNAL_LIMITS[effectiveTier] || 0;
}

export function canAccessReflection(profile) {
  return canAccess(profile, 'peregrino');
}
