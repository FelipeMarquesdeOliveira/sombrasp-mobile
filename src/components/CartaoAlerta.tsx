import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

import { Icone } from './Icone';
import { Texto } from './Texto';

import {
  formatarTemperatura,
  mensagemPadrao,
  rotuloFonte,
  tituloNivel,
  type AlertaCalor,
  type ResumoAlerta,
} from '@/domain';
import { useTema } from '@/theme';

const graus = (t: number) => `${Math.round(t)}°`;

/**
 * Alerta do dia no estilo do app Tempo: gradiente da cor do nível, temperatura
 * grande e fina, recado em linguagem simples e a previsão de amanhã no rodapé.
 * O nível também vem escrito e com ícone (a cor não é o único sinal).
 */
export function CartaoAlerta({ alerta, amanha }: { alerta: AlertaCalor | null; amanha?: ResumoAlerta | null }) {
  const { cores, espaco, raio, elevacao } = useTema();
  const nivel = alerta?.nivel ?? null;
  const tom = cores.nivel[nivel ?? 'SEM_ALERTA'];
  const titulo = tituloNivel(nivel);
  const mensagem = alerta?.mensagem ?? mensagemPadrao(null);

  const partesRotulo = [
    alerta
      ? `${titulo} hoje no Centro de São Paulo. Máxima de ${formatarTemperatura(alerta.temperaturaMaxima).replace(' °C', ' graus')}.`
      : `${titulo} hoje no Centro de São Paulo.`,
    mensagem,
    alerta ? `${rotuloFonte(alerta.fonte)}.` : null,
    amanha
      ? `Amanhã: ${tituloNivel(amanha.nivel).toLowerCase()}, até ${Math.round(amanha.temperaturaMaxima)} graus.`
      : null,
  ];

  return (
    <View
      accessible
      accessibilityRole={nivel ? 'alert' : 'summary'}
      accessibilityLabel={partesRotulo.filter(Boolean).join(' ')}
      style={[{ borderRadius: raio.xl, borderCurve: 'continuous' }, elevacao.media]}
    >
      <LinearGradient
        colors={tom.gradiente}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderRadius: raio.xl, borderCurve: 'continuous', padding: espaco.lg - 4, gap: espaco.xs }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Icone nome={nivel ? 'alerta' : 'ok'} cor={tom.icone} tamanho={16} />
            <Texto variante="legenda" cor={tom.texto} style={{ fontWeight: '600' }}>
              {nivel ? `Alerta de ${titulo.toLowerCase()}` : titulo}
            </Texto>
          </View>
          <Icone nome={nivel ? 'sol' : 'nuvemSol'} cor={tom.icone} tamanho={28} />
        </View>

        {alerta && (
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: espaco.sm }}>
            <Texto variante="destaque" cor={tom.texto}>
              {graus(alerta.temperaturaMaxima)}
            </Texto>
            <Texto variante="legenda" cor={tom.textoSuave} style={{ marginBottom: espaco.md }}>
              máxima hoje
            </Texto>
          </View>
        )}

        <Texto variante="corpoNegrito" cor={tom.texto} style={{ marginTop: alerta ? 0 : espaco.sm }}>
          {mensagem}
        </Texto>
        {alerta && (
          <Texto variante="nota" cor={tom.textoSuave}>
            {rotuloFonte(alerta.fonte)}
          </Texto>
        )}

        {amanha && (
          <>
            <View
              style={{
                height: StyleSheet.hairlineWidth,
                backgroundColor: tom.textoSuave,
                opacity: 0.6,
                marginVertical: espaco.sm,
              }}
            />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: espaco.sm }}>
              <Icone nome="calendario" cor={tom.icone} tamanho={16} />
              <Texto variante="legenda" cor={tom.texto} style={{ flex: 1 }}>
                Amanhã · {tituloNivel(amanha.nivel).toLowerCase()}
              </Texto>
              <Texto variante="corpoNegrito" cor={tom.texto}>
                até {graus(amanha.temperaturaMaxima)}
              </Texto>
            </View>
          </>
        )}
      </LinearGradient>
    </View>
  );
}
