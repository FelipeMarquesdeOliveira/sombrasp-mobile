"""
Gera o ícone, o ícone adaptativo do Android e a imagem da splash do SombraSP.

Desenho no padrão dos ícones do iOS: fundo em gradiente laranja (o calor),
sol amarelo-claro e uma gota azul na frente (a água e o alívio).
Cores tiradas da paleta do design system (src/theme/paleta.ts).

Uso: python3 scripts/gerar-icones.py   (precisa do Pillow)
"""
import math
from pathlib import Path

from PIL import Image, ImageDraw

LARANJA_400 = (0xF9, 0x73, 0x16)
LARANJA_700 = (0xC2, 0x41, 0x0C)
SOL_200 = (0xFF, 0xE0, 0x8A)
AGUA_700 = (0x0B, 0x53, 0x94)
BRANCO = (0xFF, 0xFF, 0xFF)

ESCALA = 4  # desenha 4x maior e reduz no fim, para bordas suaves
SAIDA = Path(__file__).resolve().parent.parent / 'assets'


def gradiente(t: int) -> Image.Image:
    """Gradiente diagonal do laranja-claro (alto, à esquerda) ao laranja-escuro."""
    img = Image.new('RGBA', (t, t))
    px = img.load()
    for y in range(t):
        for x in range(t):
            k = (x + y) / (2 * (t - 1))
            px[x, y] = tuple(round(a + (b - a) * k) for a, b in zip(LARANJA_400, LARANJA_700)) + (255,)
    return img


def desenhar_marca(tamanho: int, fundo, area: float = 1.0) -> Image.Image:
    """Desenha a marca num quadrado. `area` encolhe o desenho (zona segura do ícone adaptativo)."""
    t = tamanho * ESCALA
    img = gradiente(t) if fundo == 'gradiente' else Image.new('RGBA', (t, t), fundo)
    d = ImageDraw.Draw(img)
    u = t * area / 100  # 1 unidade = 1% do desenho
    ox = oy = (t - t * area) / 2

    def p(x, y):
        return (ox + x * u, oy + y * u)

    # Sol: disco laranja com 8 raios, no alto à esquerda.
    cx, cy, r = 40, 40, 17
    for i in range(8):
        ang = math.radians(i * 45)
        x1, y1 = cx + math.cos(ang) * (r + 6), cy + math.sin(ang) * (r + 6)
        x2, y2 = cx + math.cos(ang) * (r + 15), cy + math.sin(ang) * (r + 15)
        d.line([p(x1, y1), p(x2, y2)], fill=SOL_200, width=int(6 * u))
        d.ellipse([p(x2 - 3, y2 - 3), p(x2 + 3, y2 + 3)], fill=SOL_200)
        d.ellipse([p(x1 - 3, y1 - 3), p(x1 + 3, y1 + 3)], fill=SOL_200)
    d.ellipse([p(cx - r, cy - r), p(cx + r, cy + r)], fill=SOL_200)

    # Gota: contorno branco + gota azul, embaixo à direita, na frente do sol.
    def gota(cx, cy, raio, cor):
        """Gota com o bico para cima: arco de círculo embaixo ligado a uma ponta."""
        ponta = (cx, cy - raio * 2.05)
        contorno = [ponta]
        for grau in range(-30, 211, 2):  # do lado direito, por baixo, até o lado esquerdo
            a = math.radians(grau)
            contorno.append((cx + math.cos(a) * raio, cy + math.sin(a) * raio))
        contorno.append(ponta)
        d.polygon([p(x, y) for x, y in contorno], fill=cor)

    gota(64, 66, 21, BRANCO)
    gota(64, 66, 17, AGUA_700)
    # brilho da gota
    d.ellipse([p(53, 63), p(59, 75)], fill=(255, 255, 255, 140))

    return img.resize((tamanho, tamanho), Image.LANCZOS)


def main():
    SAIDA.mkdir(exist_ok=True)
    desenhar_marca(1024, 'gradiente').convert('RGB').save(SAIDA / 'icon.png')
    desenhar_marca(1024, (0, 0, 0, 0), area=0.62).save(SAIDA / 'android-icon-foreground.png')
    desenhar_marca(1024, (0, 0, 0, 0), area=0.9).save(SAIDA / 'splash-icon.png')
    desenhar_marca(48, 'gradiente').convert('RGB').save(SAIDA / 'favicon.png')
    print('ícones gerados em', SAIDA)


if __name__ == '__main__':
    main()
