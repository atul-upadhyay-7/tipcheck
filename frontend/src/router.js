export const ROUTES = new Set(['/', '/check/message', '/check/context', '/check/result']);
export function routeFromHash(hash) {const path = hash.replace(/^#/, '') || '/';return ROUTES.has(path) ? path : '/';}
export function routeNeedsResult(route) {return route === '/check/result';}
