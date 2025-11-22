export function rtfEncode(str: string): string {
  return str
    .split('')
    .map(ch => {
      const code = ch.charCodeAt(0);
      if (code > 127) {
        return `\\u${code}?`;
      }
      if (ch === '\\') return '\\\\';
      if (ch === '{') return '\\{';
      if (ch === '}') return '\\}';
      return ch;
    })
    .join('');
}
