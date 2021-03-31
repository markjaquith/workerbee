/**
 * These are parameters that are frequently injected into URLs before people visit your site.
 * They are used for various tracking scripts like Facebook, Google Analytics, etc.
 *
 * The stripParamsForFetch handler strips these from the upstream request to your server. Your
 * server doesn't need to see them. They are "seen" in the window.location of a visitor's
 * browser by the various JavaScript things you may have installed on your site.
 *
 * Note that they will remain in the user's address bar. We're not redirecting them.
 *
 * However, if your server returns a redirect, we will re-inject any stripped parameters, so
 * that any tracking information you want is maintained.
 *
 * This is just a default list. You can pass your own list to stripParamsForFetch.
 */
export const STRIP_PARAMS = [
	'fbclid',
	'gclid',
	'msclkid',
	'utm_source',
	'utm_medium',
	'utm_campaign',
	'utm_content',
	'utm_term',
	'utm_expid',
	'fb_action_ids',
	'fb_action_types',
	'fb_source',
	'_ga',
	'age-verified',
	'ao_noptimize',
	'usqp',
	'cn-reloaded',
	'_ke',
]
