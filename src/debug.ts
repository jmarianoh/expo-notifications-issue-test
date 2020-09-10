import { stringify } from './stringify';

const debugTexts: string[] = [];
let nextDebugId = 1;

export function debug(...args: unknown[]): void {
	debugTexts.push(
		`[#${nextDebugId++}] ${args.map((x) => stringify(x)).join(' ')}`,
	);
}

export function getDebugValue(): string {
	return debugTexts.join(' §§ ');
}
