import { useState, type ReactNode } from 'react';
import { ScrollView, View } from 'react-native';

import {
  AcaoRapida,
  Aviso,
  Botao,
  CartaoAlerta,
  EstadoErro,
  EstadoVazio,
  Filtro,
  Grupo,
  ICONE_TIPO,
  Linha,
  LinhaPonto,
  Selo,
  Texto,
  Titulo,
} from '@/components';
import { dataISO, rotuloTipo, type AlertaCalor, type PontoProximo, type TipoPonto } from '@/domain';
import { contraste, formatarContraste, paleta, useTema, type VarianteTexto } from '@/theme';

/**
 * Guia visual: o design system do SombraSP ao vivo, lido dos próprios tokens.
 * Se um token mudar, esta tela muda junto (não há cor copiada aqui).
 */

const ALERTA_EXEMPLO: AlertaCalor = {
  id: 0,
  dataReferencia: dataISO(),
  temperaturaMaxima: 34.2,
  nivel: 'ALERTA',
  fonte: 'ESTACAO_ESP32',
  mensagem: 'Calor forte agora no Centro. Procure sombra e beba água a cada 20 minutos.',
  ativo: true,
  emitidoEm: '',
  encerradoEm: null,
};

const PONTO_EXEMPLO: PontoProximo = {
  id: 0,
  nome: 'Tenda de hidratação (exemplo)',
  tipo: 'SOMBRA_E_HIDRATACAO',
  bairro: 'Sé',
  logradouro: 'Praça da Sé',
  acessivel: true,
  horarioFuncionamento: '08h às 18h',
  distanciaKm: 0.36,
};

const NOME_ESCALA: Record<keyof typeof paleta, string> = {
  cinza: 'Cinzas do sistema',
  laranja: 'Laranja (calor e destaque)',
  sol: 'Sol (ícones)',
  vermelho: 'Vermelho (calor extremo e erro)',
  ceu: 'Céu (informação)',
  agua: 'Água (hidratação)',
  folha: 'Folha (sombra)',
  brisa: 'Brisa (sombra e água)',
};

const VARIANTES: { nome: VarianteTexto; estilo: string; exemplo: string }[] = [
  { nome: 'destaque', estilo: 'Temperatura', exemplo: '34°' },
  { nome: 'tituloGrande', estilo: 'Large Title', exemplo: 'Perto de mim' },
  { nome: 'titulo', estilo: 'Title 1', exemplo: 'Tenda da Sé' },
  { nome: 'subtitulo', estilo: 'Title 3', exemplo: 'Nenhum ponto encontrado' },
  { nome: 'corpoNegrito', estilo: 'Headline', exemplo: '360 m · 5 min a pé' },
  { nome: 'corpo', estilo: 'Body', exemplo: 'Beba água a cada 20 minutos.' },
  { nome: 'legenda', estilo: 'Subheadline', exemplo: 'Rua Direita · Sé' },
  { nome: 'nota', estilo: 'Footnote', exemplo: 'Mais perto de você' },
];

function Secao({ titulo, descricao, children }: { titulo: string; descricao?: string; children: ReactNode }) {
  const { cores, espaco } = useTema();
  return (
    <View style={{ gap: espaco.sm + 4 }}>
      <View style={{ gap: 2 }}>
        <Titulo nivel="subtitulo">{titulo}</Titulo>
        {descricao && (
          <Texto variante="legenda" cor={cores.texto.secundario}>
            {descricao}
          </Texto>
        )}
      </View>
      {children}
    </View>
  );
}

/** Linha com amostra da cor, nome do token e o contraste medido do texto por cima. */
function Amostra({ nome, cor, textoSobre }: { nome: string; cor: string; textoSobre?: string }) {
  const { cores, espaco, raio } = useTema();
  const razao = textoSobre ? contraste(textoSobre, cor) : null;
  return (
    <View
      accessible
      accessibilityLabel={`${nome}, ${cor}${razao ? `, contraste ${formatarContraste(razao)}` : ''}`}
      style={{ flexDirection: 'row', alignItems: 'center', gap: espaco.md - 4, paddingHorizontal: espaco.md, paddingVertical: espaco.sm + 2 }}
    >
      <View
        style={{
          width: 44,
          height: 32,
          borderRadius: raio.icone,
          backgroundColor: cor,
          borderWidth: 0.5,
          borderColor: cores.separador,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {textoSobre && (
          <Texto variante="legenda" cor={textoSobre} style={{ fontWeight: '600' }}>
            Aa
          </Texto>
        )}
      </View>
      <View style={{ flex: 1 }}>
        <Texto>{nome}</Texto>
        <Texto variante="nota" cor={cores.texto.secundario}>
          {cor}
          {razao ? ` · contraste ${formatarContraste(razao)}` : ''}
        </Texto>
      </View>
    </View>
  );
}

export default function TelaGuiaVisual() {
  const { cores, espaco, raio, tipografia, toque } = useTema();
  const [filtro, setFiltro] = useState(true);
  const [opcao, setOpcao] = useState<'a' | 'b'>('a');

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: cores.fundo.tela }}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ padding: espaco.md, gap: espaco.xl, paddingBottom: espaco.xxl }}
    >
      <Texto variante="legenda" cor={cores.texto.secundario} style={{ marginTop: -espaco.sm }}>
        Design system "Clima", no padrão visual do iPhone. Fundo cinza agrupado, células brancas e uma única cor de
        destaque: o laranja do calor. Verde e azul marcam onde há alívio.
      </Texto>

      <Secao titulo="1. Paleta base" descricao="Cores cruas. As telas não usam estas cores direto, só pelos tokens.">
        {(Object.keys(paleta) as (keyof typeof paleta)[]).map((nomeEscala) => (
          <View key={nomeEscala} style={{ gap: espaco.xs }}>
            <Texto variante="nota" cor={cores.texto.secundario} style={{ textTransform: 'uppercase' }}>
              {NOME_ESCALA[nomeEscala]}
            </Texto>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
              {Object.entries(paleta[nomeEscala]).map(([passo, cor]) => (
                <View
                  key={passo}
                  accessible
                  accessibilityLabel={`${NOME_ESCALA[nomeEscala]} ${passo}, ${cor}`}
                  style={{ alignItems: 'center', width: 38 }}
                >
                  <View
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: raio.icone,
                      backgroundColor: cor,
                      borderWidth: 0.5,
                      borderColor: cores.separador,
                    }}
                  />
                  <Texto variante="nota" cor={cores.texto.secundario}>
                    {passo}
                  </Texto>
                </View>
              ))}
            </View>
          </View>
        ))}
      </Secao>

      <Secao titulo="2. Tokens semânticos" descricao="O papel de cada cor, com o contraste medido do texto por cima.">
        <Grupo titulo="Base" recuoSeparador={72}>
          <Amostra nome="fundo.tela" cor={cores.fundo.tela} textoSobre={cores.texto.principal} />
          <Amostra nome="fundo.cartao" cor={cores.fundo.cartao} textoSobre={cores.texto.secundario} />
          <Amostra nome="tint (destaque)" cor={cores.tint} textoSobre={cores.texto.sobreCor} />
        </Grupo>
        <Grupo titulo="Ação" recuoSeparador={72}>
          <Amostra nome="acao.primaria" cor={cores.acao.primaria.fundo} textoSobre={cores.acao.primaria.texto} />
          <Amostra nome="acao.secundaria" cor={cores.acao.secundaria.fundo} textoSobre={cores.acao.secundaria.texto} />
          <Amostra nome="acao.perigo" cor={cores.acao.perigo.fundo} textoSobre={cores.acao.perigo.texto} />
        </Grupo>
        <Grupo titulo="Nível do alerta (início do gradiente)" recuoSeparador={72}>
          <Amostra nome="Calor forte" cor={cores.nivel.ALERTA.gradiente[0]} textoSobre={cores.nivel.ALERTA.texto} />
          <Amostra nome="Calor extremo" cor={cores.nivel.EMERGENCIA.gradiente[0]} textoSobre={cores.nivel.EMERGENCIA.texto} />
          <Amostra nome="Sem alerta" cor={cores.nivel.SEM_ALERTA.gradiente[0]} textoSobre={cores.nivel.SEM_ALERTA.texto} />
        </Grupo>
        <Grupo titulo="Tipo do ponto" recuoSeparador={72}>
          {(Object.keys(cores.tipo) as TipoPonto[]).map((tipo) => (
            <Amostra key={tipo} nome={rotuloTipo(tipo)} cor={cores.tipo[tipo].fundo} textoSobre={cores.texto.sobreCor} />
          ))}
        </Grupo>
      </Secao>

      <Secao
        titulo="3. Tipografia"
        descricao="Fonte do sistema (San Francisco) com os estilos de texto do iOS. Acompanha o ajuste de letra."
      >
        <Grupo>
          {VARIANTES.map((variante) => (
            <View key={variante.nome} style={{ paddingHorizontal: espaco.md, paddingVertical: espaco.sm + 2 }}>
              <Texto variante="nota" cor={cores.texto.secundario}>
                {variante.estilo} · {tipografia[variante.nome].fontSize} pt
              </Texto>
              <Texto variante={variante.nome}>{variante.exemplo}</Texto>
            </View>
          ))}
        </Grupo>
      </Secao>

      <Secao
        titulo="4. Espaço e cantos"
        descricao={`Grade de 4 pt e margens de 16 pt. Toque mínimo de ${toque.minimo} pt; linhas e botões com ${toque.linha} pt.`}
      >
        <Grupo>
          <View style={{ padding: espaco.md, gap: espaco.sm }}>
            {(Object.entries(espaco) as [string, number][]).map(([nome, valor]) => (
              <View key={nome} style={{ flexDirection: 'row', alignItems: 'center', gap: espaco.md }}>
                <Texto variante="nota" style={{ width: 64 }}>
                  {nome} · {valor}
                </Texto>
                <View style={{ height: 10, width: valor * 3, backgroundColor: cores.tint, borderRadius: 5 }} />
              </View>
            ))}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: espaco.md, paddingTop: espaco.sm }}>
              {(Object.entries(raio) as [string, number][]).map(([nome, valor]) => (
                <View key={nome} style={{ alignItems: 'center', gap: 2 }}>
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: Math.min(valor, 22),
                      borderCurve: 'continuous',
                      backgroundColor: cores.acao.secundaria.fundo,
                    }}
                  />
                  <Texto variante="nota">{nome}</Texto>
                </View>
              ))}
            </View>
          </View>
        </Grupo>
      </Secao>

      <Secao titulo="5. Botões" descricao="Um botão preenchido por tela: a ação principal. As outras ações são tingidas.">
        <Botao rotulo="Ação principal" icone="local" aoPressionar={() => {}} />
        <Botao variante="secundario" rotulo="Ação tingida" icone="salvar" aoPressionar={() => {}} />
        <Botao variante="neutro" rotulo="Ação neutra" aoPressionar={() => {}} />
        <Botao variante="perigo" rotulo="Apagar" icone="lixeira" aoPressionar={() => {}} />
        <View style={{ flexDirection: 'row', gap: espaco.sm }}>
          <AcaoRapida destaque rotulo="Como chegar" icone="rota" aoPressionar={() => {}} />
          <AcaoRapida rotulo="Salvar" icone="salvar" aoPressionar={() => {}} />
          <AcaoRapida rotulo="Registrar pausa" icone="copo" aoPressionar={() => {}} />
        </View>
      </Secao>

      <Secao titulo="6. Listas, filtros e selos">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: espaco.sm }}>
          <Filtro rotulo="Ligado" icone="gota" selecionado={filtro} aoAlternar={() => setFiltro((v) => !v)} />
          <Filtro rotulo="Desligado" icone="folha" selecionado={!filtro} aoAlternar={() => setFiltro((v) => !v)} />
        </View>
        <Grupo titulo="Linhas" rodape="Rodapé do grupo: explica a seção em uma frase." recuoSeparador={58}>
          <Linha icone="relogio" corIcone={cores.icone.laranja} sobretitulo="Horário" titulo="08h às 18h" />
          <Linha icone="dados" corIcone={cores.icone.azul} titulo="Linha com valor" valor="Valor" />
          <Linha icone="paleta" corIcone={cores.icone.verde} titulo="Linha tocável" aoPressionar={() => {}} />
          <Linha titulo="Opção marcada" marcado={opcao === 'a'} aoPressionar={() => setOpcao('a')} />
          <Linha titulo="Opção livre" marcado={opcao === 'b'} aoPressionar={() => setOpcao('b')} />
        </Grupo>
        <Grupo recuoSeparador={64}>
          <LinhaPonto ponto={PONTO_EXEMPLO} aoPressionar={() => {}} />
        </Grupo>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: espaco.sm }}>
          {(Object.keys(cores.tipo) as TipoPonto[]).map((tipo) => (
            <Selo
              key={tipo}
              texto={rotuloTipo(tipo)}
              fundo={cores.tipo[tipo].suave}
              cor={cores.tipo[tipo].texto}
              icone={ICONE_TIPO[tipo]}
            />
          ))}
          <Selo texto="Acessível" fundo={cores.fundo.preenchimento} cor={cores.texto.principal} icone="acessivel" />
        </View>
      </Secao>

      <Secao titulo="7. Avisos e alertas">
        <Aviso tipo="info" mensagem="Informação: distâncias a partir de onde você está." />
        <Aviso tipo="sucesso" mensagem="Confirmação: ponto salvo." />
        <Aviso tipo="erro" mensagem="Erro: não foi possível salvar." />
        <CartaoAlerta
          alerta={ALERTA_EXEMPLO}
          amanha={{ id: 1, dataReferencia: '', temperaturaMaxima: 33.5, nivel: 'ALERTA', fonte: 'MODELO_IA_INMET', ativo: true }}
        />
        <CartaoAlerta
          alerta={{ ...ALERTA_EXEMPLO, nivel: 'EMERGENCIA', temperaturaMaxima: 37.1, mensagem: 'Calor extremo. Procure um ponto de apoio.' }}
        />
        <CartaoAlerta alerta={null} />
      </Secao>

      <Secao titulo="8. Estados de dados" descricao="Toda tela que busca dados mostra carregando, erro ou vazio.">
        <Grupo>
          <EstadoErro mensagem="Sem conexão no momento. Confira a internet e tente de novo." aoTentarDeNovo={() => {}} />
        </Grupo>
        <Grupo>
          <EstadoVazio icone="busca" titulo="Nada por aqui" mensagem="Explique por que está vazio e o que fazer." />
        </Grupo>
      </Secao>
    </ScrollView>
  );
}
