/** Razão de contraste da WCAG 2.1 entre duas cores #RRGGBB (de 1 a 21). */
export function contraste(a: string, b: string): number {
  const luminancia = (hex: string) => {
    const [r, g, bl] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
    const canal = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
    return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(bl);
  };
  const [claro, escuro] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
  return (claro + 0.05) / (escuro + 0.05);
}

/** "12,3:1" */
export function formatarContraste(razao: number): string {
  return `${razao.toFixed(1).replace('.', ',')}:1`;
}
