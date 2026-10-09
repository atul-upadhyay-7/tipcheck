import {QUESTIONS} from './questions.js';
export const ROUTES = new Set(['/', '/check/message', '/check/context', '/check/review', '/check/result', ...QUESTIONS.map(q=>q.route)]);
export function routeFromHash(hash) {const path = hash.replace(/^#/, '') || '/';return path==='/check/context'?'/check/recipient':ROUTES.has(path) ? path : '/';}
export function routeNeedsResult(route) {return route === '/check/result';}
