const ensureError = require('ensure-error');
const jsonStringifySafe = require('json-stringify-safe');

export function stringify(arg: unknown): string {
	if (typeof arg === 'string') {
		return arg;
	}
	if (!arg || typeof arg !== 'object') {
		return String(arg);
	}
	if (Object.prototype.toString.call(arg) === '[object Error]') {
		const { message, stack } = ensureError(arg);
		const printableMessage = JSON.stringify(message);
		const printableStack = JSON.stringify(stack.slice(0, 70));
		return `[ERROR: ${printableMessage} [Beginning of stack: ${printableStack}]]`;
	}
	return jsonStringifySafe(arg);
}
