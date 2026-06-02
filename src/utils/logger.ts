const sanitize = (value: unknown): string =>
  String(value).replace(/[\r\n\t]/g, ' ').replace(/[^\x20-\x7E\u00A0-\uFFFF]/g, '')

export const logger = {
  log: (message: string, ...args: unknown[]) =>
    console.log(message, ...args.map(sanitize)),
  error: (message: string, ...args: unknown[]) =>
    console.error(message, ...args.map(sanitize)),
}
