# Design system do SombraSP: "Clima"

Este é o padrão visual do app, inspirado nos apps nativos do iPhone (Tempo, Mapas e Ajustes) e nas Human Interface Guidelines da Apple. Ele vale para toda tela e todo componente novo.

O catálogo ao vivo fica no próprio app, em **Ajustes → Guia visual** (`app/guia-visual.tsx`). Ele lê os mesmos tokens do código, então nunca fica desatualizado.

## 1. Princípios

1. **Parecer nativo.** O app usa os elementos do próprio iOS:
   - a barra de abas do sistema, com o vidro do iOS 26;
   - o título grande que encolhe ao rolar;
   - os SF Symbols (os ícones do iPhone);
   - a fonte San Francisco;
   - as listas agrupadas e os alertas do sistema;
   - a vibração de confirmação.
2. **Neutro com uma cor de destaque.** A tela é cinza-claro com células brancas. A cor só aparece onde importa:
   - **laranja** é a cor de destaque (o "tint" do iOS) e o calor;
   - **vermelho** marca o calor extremo;
   - **verde e azul** marcam onde há alívio (sombra e água).
3. **Ler debaixo do sol.** Todo texto passa de 4,5:1 de contraste (WCAG 2.1 AA). O cinza secundário padrão do iOS (`#8A8A8E`, 3,4:1) não é usado em texto; no lugar dele entra um cinza mais escuro (`#636366`).
4. **Cor nunca é o único sinal.** Nível do alerta, tipo do ponto, filtro ligado, aba ativa e opção marcada também têm texto, ícone ou marca de seleção (✓).
5. **Um botão preenchido por tela.** É a ação principal. As outras ações são tingidas (fundo laranja-claro) ou ficam em linhas de lista.
6. **Alvos de toque grandes.** O mínimo é 44 pt, como recomenda o iOS. Linhas e botões têm 52 pt.

## 2. Arquitetura em camadas

```
paleta.ts         cores cruas (cinzas do iOS, laranja, vermelho, céu, água, folha, brisa)
   │
cores.ts          tokens semânticos: fundo.tela, texto.secundario, tint, acao.primaria, nivel.ALERTA…
   │              (+ tipografia.ts, espacamento.ts, elevacao.ts)
   │
useTema()         entrega os tokens com a letra no tamanho escolhido pela pessoa
   │
src/components    Grupo, Linha, Botao, Filtro, CartaoAlerta, LinhaPonto, Aviso… (só usam tokens)
   │
app/              telas montadas com os componentes
```

**Regra:** nenhuma tela escreve uma cor em hexadecimal; o projeto é conferido por busca. Para mudar um tom, altere a paleta. Para mudar o papel de uma cor, altere o token. A troca chega ao app inteiro.

| Arquivo | O que tem |
|---|---|
| `src/theme/paleta.ts` | Camada 1: as escalas de cor |
| `src/theme/cores.ts` | Camada 2: os tokens semânticos |
| `src/theme/tipografia.ts` | Estilos de texto do iOS e tamanhos de letra (Normal, Grande, Muito grande) |
| `src/theme/espacamento.ts` | Espaços, raios e áreas de toque |
| `src/theme/elevacao.ts` | Sombras |
| `src/theme/contraste.ts` | Cálculo de contraste da WCAG, usado no teste e no guia visual |
| `src/theme/__tests__/contraste.test.ts` | Teste que reprova a build se alguma combinação perder contraste |
| `src/navegacao/cabecalho.ts` | Opções do cabeçalho nativo (título grande e barra simples) |

## 3. Paleta base

| Escala | Passos |
|---|---|
| `cinza` (sistema iOS) | 0 `#FFFFFF` · **50 `#F2F2F7`** · 80 `#F9F9F9` · 100 `#E5E5EA` · 200 `#D1D1D6` · 300 `#C6C6C8` · 500 `#8A8A8E` · 600 `#6C6C70` · **700 `#636366`** · 800 `#3A3A3C` · **900 `#1C1C1E`** |
| `laranja` (calor e destaque) | 50 `#FFF7ED` · 100 `#FFEDD5` · 300 `#FDBA74` · 500 `#EA580C` · **700 `#C2410C`** · 800 `#9A3412` · 900 `#7C2D12` |
| `sol` (ícones) | 200 `#FFE08A` · 400 `#FFD60A` |
| `vermelho` (calor extremo e erro) | 50 `#FDECEC` · **700 `#B91C1C`** · 900 `#7F1D1D` |
| `ceu` (informação) | 50 `#E6F3FB` · **700 `#0E6BA8`** · 900 `#0A4A75` |
| `agua` (hidratação) | 50 `#E8F0FA` · **700 `#0B5394`** |
| `folha` (sombra) | 50 `#E3F4E7` · 700 `#1E7B34` · **800 `#2F6B1F`** |
| `brisa` (sombra e água) | 50 `#E3F4F4` · **700 `#0F6E6E`** |

## 4. Tokens semânticos

| Grupo | Token | Cor | Uso |
|---|---|---|---|
| Fundo | `fundo.tela` | `#F2F2F7` | Fundo agrupado de todas as telas (systemGroupedBackground) |
| | `fundo.cartao` | `#FFFFFF` | Células e cartões |
| | `fundo.preenchimento` | `#E5E5EA` | Botão cinza e selo neutro |
| | `fundo.pressionado` | `#E5E5EA` | Linha pressionada |
| Texto | `texto.principal` | `#1C1C1E` | Rótulos (label) |
| | `texto.secundario` | `#636366` | Subtítulos, valores à direita, cabeçalhos e rodapés de seção |
| | `texto.sobreCor` | `#FFFFFF` | Texto sobre o cartão do alerta e os quadrados de ícone |
| Separador | `separador` | `#C6C6C8` | Linhas finas entre células e a seta ">" |
| Destaque | `tint` | `#C2410C` | Marca de seleção, ícones soltos, aba ativa, botão "Voltar" |
| Ação | `acao.primaria` | fundo `#C2410C`, texto branco | Botão preenchido (um por tela) |
| | `acao.secundaria` | fundo `#FFEDD5`, texto `#9A3412` | Botão tingido |
| | `acao.neutra` | fundo `#E5E5EA`, texto `#1C1C1E` | Botão cinza |
| | `acao.perigo` | texto `#B91C1C` | Linha destrutiva ("Apagar histórico") |
| Seleção | `selecao` | fundo `#C2410C`, texto branco | Filtro ligado |
| Avisos | `feedback.info` / `sucesso` / `erro` | `#E6F3FB` / `#E3F4E7` / `#FDECEC` | Faixas tingidas com ícone |
| Alerta de calor | `nivel.ALERTA.gradiente` | `#C2410C → #9A3412` | Calor forte, máxima de 31 °C ou mais |
| | `nivel.EMERGENCIA.gradiente` | `#B91C1C → #7F1D1D` | Calor extremo, máxima de 35 °C ou mais |
| | `nivel.SEM_ALERTA.gradiente` | `#0E6BA8 → #0A4A75` | Dia sem alerta |
| Tipo do ponto | `tipo.SOMBRA` | quadrado `#2F6B1F`, selo `#E3F4E7`/`#1E7B34` | Ponto de sombra |
| | `tipo.HIDRATACAO` | quadrado `#0B5394`, selo `#E8F0FA`/`#0B5394` | Ponto de água |
| | `tipo.SOMBRA_E_HIDRATACAO` | quadrado `#0F6E6E`, selo `#E3F4F4`/`#0F6E6E` | Ponto com sombra e água |
| Ícones de linha | `icone.laranja` / `azul` / `verde` / `vermelho` / `cinza` | — | Quadrados coloridos das linhas, como nos Ajustes do iPhone |

Os níveis de alerta e os tipos de ponto são os mesmos da API de SOA (`NivelAlerta`, `TipoPonto`).

## 5. Contraste medido

Os valores foram calculados com a fórmula da WCAG 2.1 a partir dos tokens. O teste `contraste.test.ts` refaz essas contas a cada `npm test`, incluindo as duas pontas de cada gradiente.

| Combinação | Cores | Contraste |
|---|---|---|
| Texto principal no fundo agrupado | `#1C1C1E` sobre `#F2F2F7` | 15,2:1 |
| Texto secundário na célula | `#636366` sobre `#FFFFFF` | 6,0:1 |
| Texto secundário no fundo agrupado | `#636366` sobre `#F2F2F7` | 5,4:1 |
| Cor de destaque (tint) na célula | `#C2410C` sobre `#FFFFFF` | 5,2:1 |
| Botão principal | `#FFFFFF` sobre `#C2410C` | 5,2:1 |
| Botão tingido | `#9A3412` sobre `#FFEDD5` | 6,4:1 |
| Linha destrutiva | `#B91C1C` sobre `#FFFFFF` | 6,5:1 |
| Filtro ligado | `#FFFFFF` sobre `#C2410C` | 5,2:1 |
| Alerta de calor forte (ponta mais clara do gradiente) | `#FFFFFF` sobre `#C2410C` | 5,2:1 |
| Alerta de calor extremo (ponta mais clara) | `#FFFFFF` sobre `#B91C1C` | 6,5:1 |
| Dia sem alerta (ponta mais clara) | `#FFFFFF` sobre `#0E6BA8` | 5,7:1 |
| Texto suave no alerta de calor forte | `#FFEDD5` sobre `#C2410C` | 4,5:1 |
| Selo de sombra | `#1E7B34` sobre `#E3F4E7` | 4,7:1 |
| Selo de água | `#0B5394` sobre `#E8F0FA` | 6,8:1 |
| Selo de sombra e água | `#0F6E6E` sobre `#E3F4F4` | 5,3:1 |
| Aviso de sucesso | `#1C1C1E` sobre `#E3F4E7` | 14,9:1 |
| Aviso de erro | `#1C1C1E` sobre `#FDECEC` | 14,9:1 |
| Aviso de informação | `#1C1C1E` sobre `#E6F3FB` | 15,1:1 |
| Aba inativa | `#6C6C70` sobre `#F9F9F9` | 5,0:1 |
| Aba ativa | `#C2410C` sobre `#F9F9F9` | 4,9:1 |
| Ícone amarelo no alerta (mínimo 3:1) | `#FFE08A` sobre `#C2410C` | 4,0:1 |
| ~~Cinza secundário padrão do iOS~~ (não usado) | `#8A8A8E` sobre `#FFFFFF` | 3,4:1 |

## 6. Tipografia

O app usa a **fonte do sistema**: San Francisco no iPhone e Roboto no Android. A SF foi desenhada para leitura em tela e é a mesma dos apps nativos. A escala segue os estilos de texto do iOS:

| Variante | Estilo do iOS | Tamanho/linha | Peso | Uso |
|---|---|---|---|---|
| `destaque` | — | 76/84 | Ultraleve (200) | Temperatura do alerta, como no app Tempo |
| `tituloGrande` | Large Title | 34/41 | Negrito | Título da tela (no cabeçalho nativo) |
| `titulo` | Title 1 | 28/34 | Negrito | Nome do ponto no detalhe |
| `subtitulo` | Title 3 | 20/25 | Semibold | Títulos de estados (vazio, erro) |
| `corpoNegrito` | Headline | 17/22 | Semibold | Nome do ponto na lista, distância |
| `corpo` | Body | 17/22 | Regular | Texto das linhas |
| `legenda` | Subheadline | 15/20 | Regular | Subtítulos e apoio |
| `nota` | Footnote | 13/18 | Regular | Cabeçalho (caixa alta) e rodapé de seção |
| `botao` | — | 17/22 | Semibold | Texto de botão |

**Tamanho da letra:** em Ajustes, a pessoa escolhe Normal (×1), Grande (×1,15) ou Muito grande (×1,3). A escolha fica salva no SQLite e vale para todas as variantes. O "Tamanho do Texto" do iPhone continua valendo por cima disso.

## 7. Espaço, cantos, toque e elevação

| Token | Valores |
|---|---|
| `espaco` | xs 4 · sm 8 · md 16 (margem das telas) · lg 24 (entre seções) · xl 32 · xxl 48 |
| `raio` | icone 8 · sm 10 · md 14 (botões) · lg 20 (grupos de lista) · xl 26 (cartão do alerta) · pilula 999 (filtros, selos) |
| `toque` | minimo 44 · linha 52 · botao 52 |
| `elevacao` | baixa (filtros) · media (cartão do alerta). O agrupamento é feito pelo contraste entre branco e cinza, não por sombra |

Todos os cantos usam `borderCurve: 'continuous'`, a curva contínua dos cantos do iOS.

## 8. Ícones

- No iPhone, os ícones são **SF Symbols**, os mesmos do sistema, via `expo-symbols`. No Android, o app usa o equivalente do Ionicons.
- O mapa de nomes fica em `ICONES` (`src/components/Icone.tsx`). As telas usam nomes em português, como `sol`, `gota`, `rota` e `acessivel`.
- Linhas de lista usam **ícone branco num quadrado colorido** (`IconeQuadrado`), como nos Ajustes do iPhone.
- Tipo do ponto: sombra `leaf.fill`, água `drop.fill`, sombra e água `umbrella.fill`.
- Os ícones são decorativos e ficam escondidos do leitor de tela, porque o texto ao lado já diz o que é.

## 9. Componentes

| Componente | Quando usar | Acessibilidade |
|---|---|---|
| `Tela` | Corpo das abas. Rolagem com recuo automático para o título grande e a barra de abas | — |
| `Grupo` | Seção de lista agrupada: cabeçalho em caixa alta, células brancas, separadores finos e rodapé | Cabeçalho com `role=header` |
| `Linha` | Célula de lista: ícone quadrado, sobretítulo, título, subtítulo, valor à direita, seta, marca de seleção, switch ou ação destrutiva | Lida como uma frase. Opções com `role=radio` e `checked`. Aceita ações do VoiceOver (ex.: "Remover") |
| `GrupoOpcoes` | Escolha única (como nos Ajustes do iPhone) | `radio` + `checked` |
| `LinhaPonto` | Ponto de apoio na lista: tipo, nome, rua, distância e minutos a pé | Frase completa com nome, tipo, distância, acessibilidade e horário |
| `CartaoAlerta` | Alerta do dia, com gradiente do nível, temperatura grande e previsão de amanhã | `role=alert`, com temperatura em "graus" por extenso |
| `Botao` | Ação principal (preenchido), apoio (tingido), neutro ou perigo | `role=button`, dica do que acontece, estado ocupado |
| `AcaoRapida` | Ações lado a lado na ficha do ponto (Como chegar, Salvar, Registrar pausa), como no app Mapas | Rótulo completo para o leitor de tela |
| `Filtro` | Cápsula liga/desliga (Sombra, Água, Acessível), com rolagem horizontal | `role=checkbox` + `checked` |
| `Selo` | Etiqueta tingida (tipo do ponto, Acessível) | Texto sempre visível |
| `Aviso` | Faixa de informação, confirmação ou erro | Erro com `role=alert`; confirmação anunciada |
| `EstadoCarregando` / `EstadoErro` / `EstadoVazio` | Estados de dados, no padrão "conteúdo indisponível" do iOS: ícone grande, título, explicação e uma ação | `busy`, `alert` e região viva |
| `Icone` / `IconeQuadrado` | SF Symbols / ícone branco em quadrado colorido | Decorativos |

## 10. Padrões de tela

- **Navegação:** são quatro abas na barra nativa do iOS. Cada aba tem sua pilha com **título grande**, que encolhe ao rolar. O detalhe do ponto e o guia visual abrem por cima, com o botão "Voltar".
- **Dados remotos sempre com três estados:** carregando, erro (com "Tentar de novo") e vazio (com o motivo e uma saída). O hook `useRecurso` entrega esses estados.
- **Localização ao vivo:** a lista de pontos acompanha a pessoa andando e se atualiza a cada 50 m.
- **Confirmações:** usam um `Aviso` de sucesso, uma **vibração de confirmação** (`expo-haptics`) e o anúncio do leitor de tela. Exemplo: "Pausa registrada às 16:52".
- **Apagar:** pede confirmação no alerta nativo do iOS, com o botão "Apagar" em vermelho.
- **Seleção:** filtros e opções dão uma vibração leve ao tocar.

## 11. Ícone e splash

O ícone tem fundo em gradiente laranja (o calor), um sol amarelo-claro e uma gota azul na frente (a água e o alívio). As imagens são geradas por `scripts/gerar-icones.py` com as cores da paleta:

- `assets/icon.png`: ícone do iOS, quadrado; o sistema arredonda os cantos;
- `assets/android-icon-foreground.png`: ícone adaptativo do Android, sobre fundo `#C2410C`;
- `assets/splash-icon.png`: tela de abertura, sobre fundo `#C2410C`;
- `assets/favicon.png`.

O ícone e a splash aparecem no app instalado (build). No Expo Go aparece a tela de carregamento do próprio Expo Go.

## 12. Checklist para algo novo

1. Existe um componente que já resolve? Use-o. Em listas, prefira `Grupo` + `Linha` a criar cartões.
2. Precisa de cor? Escolha um token de `cores.ts`. Se nenhum servir, crie um token a partir da paleta, nunca um hexadecimal na tela.
3. Texto sobre um fundo novo? Acrescente o par em `contraste.test.ts` e rode `npm test`.
4. Todo elemento tocável precisa de `accessibilityRole`, de um rótulo que se entenda sem ver a tela e de pelo menos 44 pt.
5. A informação não pode depender só da cor: inclua texto, ícone ou ✓.
6. Só um botão preenchido por tela.
7. Confira a tela com a letra em "Muito grande".
