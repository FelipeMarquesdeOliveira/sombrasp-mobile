import { useRouter } from 'expo-router';
import { Switch } from 'react-native';

import { Grupo, GrupoOpcoes, Linha, Tela, type Opcao } from '@/components';
import { usePreferencias, type RaioKm } from '@/context/PreferenciasContext';
import { LIMIAR_ALERTA_C } from '@/domain';
import { usandoMock, type CenarioCalor } from '@/services';
import { useTema, type TamanhoLetra } from '@/theme';
import { haptico } from '@/utils/haptico';

const TAMANHOS: Opcao<TamanhoLetra>[] = [
  { valor: 'normal', rotulo: 'Normal' },
  { valor: 'grande', rotulo: 'Grande' },
  { valor: 'muito_grande', rotulo: 'Muito grande' },
];

const RAIOS: Opcao<RaioKm>[] = [
  { valor: 1, rotulo: 'Até 1 km', descricao: 'Cerca de 15 minutos a pé' },
  { valor: 2, rotulo: 'Até 2 km', descricao: 'Cerca de 30 minutos a pé' },
  { valor: 5, rotulo: 'Até 5 km', descricao: 'Todo o Centro' },
];

const CENARIOS: Opcao<CenarioCalor>[] = [
  { valor: 'sem_alerta', rotulo: 'Dia sem alerta', descricao: 'Máxima abaixo de 31 °C' },
  { valor: 'calor_forte', rotulo: 'Calor forte', descricao: 'Hoje e amanhã acima de 31 °C' },
  { valor: 'calor_extremo', rotulo: 'Calor extremo', descricao: 'Hoje e amanhã acima de 35 °C' },
];

export default function TelaAjustes() {
  const { cores } = useTema();
  const prefs = usePreferencias();
  const router = useRouter();
  const escolher =
    <T,>(definir: (valor: T) => unknown) =>
    (valor: T) => {
      haptico.selecao();
      definir(valor);
    };

  return (
    <Tela subtitulo="As escolhas ficam salvas neste celular.">
      <GrupoOpcoes
        titulo="Tamanho da letra"
        rodape="O tamanho de texto do sistema do celular também vale."
        opcoes={TAMANHOS}
        valor={prefs.tamanhoLetra}
        aoEscolher={escolher(prefs.definirTamanhoLetra)}
      />

      <GrupoOpcoes
        titulo="Distância da busca"
        opcoes={RAIOS}
        valor={prefs.raioKm}
        aoEscolher={escolher(prefs.definirRaioKm)}
      />

      {usandoMock && (
        <>
          <GrupoOpcoes
            titulo="Demonstração · cenário de calor"
            opcoes={CENARIOS}
            valor={prefs.cenarioCalor}
            aoEscolher={escolher(prefs.definirCenarioCalor)}
          />
          <Grupo rodape="Só para testar o app com os dados simulados. Essas opções não ficam salvas.">
            <Linha
              icone="teste"
              corIcone={cores.icone.cinza}
              titulo="Simular falha de conexão"
              acessorio={
                <Switch
                  value={prefs.falhaDeConexao}
                  onValueChange={(valor) => {
                    haptico.selecao();
                    prefs.definirFalhaDeConexao(valor);
                  }}
                  accessibilityLabel="Simular falha de conexão"
                  accessibilityHint="Faz as telas mostrarem a mensagem de erro e o botão Tentar de novo"
                  trackColor={{ true: cores.tint }}
                />
              }
            />
          </Grupo>
        </>
      )}

      <Grupo
        titulo="Sobre"
        rodape="O app não pede nome, CPF nem telefone. A localização serve só para calcular distâncias e não é guardada."
        recuoSeparador={58}
      >
        <Linha
          icone="paleta"
          corIcone={cores.icone.laranja}
          titulo="Guia visual"
          aoPressionar={() => router.push('/guia-visual')}
          dica="Abre o catálogo do design do app"
        />
        <Linha
          icone="dados"
          corIcone={cores.icone.azul}
          titulo="Fonte dos dados"
          valor={usandoMock ? 'Simulados' : 'API de SOA'}
        />
        <Linha icone="termometro" corIcone={cores.icone.vermelho} titulo="Alerta de calor" valor={`≥ ${LIMIAR_ALERTA_C} °C`} />
        <Linha icone="privacidade" corIcone={cores.icone.verde} titulo="Dados pessoais" valor="Nenhum" />
      </Grupo>

      <Grupo titulo="Equipe" rodape="FIAP · Engenharia de Software · 3ESPH · Global Solution 2026.2">
        <Linha titulo="Felipe Marques de Oliveira" valor="RM 556319" />
        <Linha titulo="Gabriel Barros Cisoto" valor="RM 556309" />
      </Grupo>
    </Tela>
  );
}
