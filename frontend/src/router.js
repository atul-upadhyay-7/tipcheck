import {QUESTIONS} from './questions.js';
export const ROUTES = new Set(['/', '/check/message', '/check/context', '/check/review', '/check/result', '/check/actions', '/learn', '/help', '/about', ...QUESTIONS.map(q=>q.route)]);
export function routeFromHash(hash) {const path = hash.replace(/^#/, '') || '/';return path==='/check/context'?'/check/recipient':ROUTES.has(path) ? path : '/';}
export function routeNeedsResult(route) {return ['/check/result','/check/actions'].includes(route);}
