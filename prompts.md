# Uso de IA

A equipe usou IA durante o desenvolvimento. Este arquivo é o registro combinado na Ficha da CitizenTech.

| Pedido (resumo) | Finalidade | O que foi aproveitado |
|---|---|---|
| Ler o enunciado de Mobile (MDI) e o projeto anterior da disciplina (CP6) | Entender os requisitos, a rubrica e seguir a mesma organização do professor (tema, componentes, camada de dados) | Plano das telas e estrutura `app/` + `src/` |
| Definir a jornada do cidadão e o banco | Escolher as telas e decidir entre SQLite local e banco em nuvem | 4 abas + detalhe; SQLite local com a justificativa no README |
| Implementar o app em Expo + TypeScript + Expo Router | Código das telas, dos componentes, da camada de serviços (mock + adaptador da API de SOA) e da camada do SQLite | `app/`, `src/` |
| Criar o design system | Primeiro uma paleta "Sol do meio-dia". Depois, a pedido da equipe, o visual foi refeito no padrão do iPhone ("Clima"): abas nativas, títulos grandes, SF Symbols, listas agrupadas e vibração | `src/theme/`, `src/components/`, `app/guia-visual.tsx`, `docs/DESIGN_SYSTEM.md`, `scripts/gerar-icones.py` |
| Escrever os testes | Regras do domínio, mock e contraste do tema | `src/**/__tests__` (76 testes) |
| Rodar no simulador e documentar | Conferir a jornada, tirar os prints e escrever o README | `docs/prints/`, `README.md` |
| Montar o vídeo da jornada | Gravar o app no simulador, escrever o roteiro e gerar a narração com voz sintetizada (pt-BR, edge-tts). A pronúncia foi conferida transcrevendo o áudio com o Whisper | Vídeo no YouTube (link no README) |

## Validação prática

- `npm run typecheck`: sem erros.
- `npm test`: 76 testes aprovados, incluindo o contraste de todas as combinações de cor do tema (e das duas pontas de cada gradiente).
- Jornada completa testada no simulador do iPhone 17 Pro (iOS 26.5) com o Expo Go:
  - salvar um ponto e registrar uma pausa;
  - fechar o app por completo e abrir de novo, conferindo que os dados voltam do SQLite (prints 05 e 06);
  - estados de carregando, erro e vazio (prints 07, 08 e 14).
- A troca do mock pela API de SOA foi testada com a API rodando no MySQL (prints 18 e 19).
- Ajustes feitos depois de ver o app rodando:
  - rótulo da aba encurtado para caber;
  - ícone da aba ativa recortado pela "pílula";
  - sol decorativo do alerta por cima do texto;
  - dois botões amarelos na mesma tela no estado de erro;
  - "puxar para atualizar" reaproveitando a posição antiga do GPS (trocado por acompanhar a localização a cada 50 m);
  - texto secundário na linha pressionada abaixo de 4,5:1, encontrado pelo teste de contraste;
  - título grande sumindo por conflito entre o desfoque manual e o efeito do iOS 26.

O app não usa IA em tempo de execução e não depende de serviço pago nem de chave.

## Responsabilidade

O código é da equipe, que responde por ele e precisa saber explicar:

- a navegação com o Expo Router;
- o contrato da camada de serviços e a troca entre mock e API;
- a camada do SQLite e a migração;
- os estados de carregando, erro e vazio;
- os tokens do design system e as decisões de acessibilidade.
