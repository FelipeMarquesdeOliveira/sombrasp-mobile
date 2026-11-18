import type { NativeStackNavigationOptions } from 'expo-router';
import { Platform } from 'react-native';

import { cores } from '@/theme/cores';

/**
 * Cabeçalho das abas no padrão do iPhone: título grande (Large Title) que
 * encolhe ao rolar e vira uma barra com o efeito de borda do iOS 26.
 */
export const cabecalhoTituloGrande: NativeStackNavigationOptions = {
  headerLargeTitle: true,
  // No iOS 26 o próprio sistema aplica o efeito de borda ao rolar (sem blurEffect manual).
  headerTransparent: Platform.OS === 'ios',
  headerShadowVisible: false,
  headerLargeTitleShadowVisible: false,
  headerStyle: { backgroundColor: Platform.OS === 'ios' ? 'transparent' : cores.fundo.tela },
  headerTintColor: cores.tint,
  headerTitleStyle: { color: cores.texto.principal },
  headerLargeTitleStyle: { color: cores.texto.principal },
  headerBackTitle: 'Voltar',
  contentStyle: { backgroundColor: cores.fundo.tela },
};

/** Cabeçalho das telas empilhadas (detalhe do ponto): barra simples com "Voltar". */
export const cabecalhoSimples: NativeStackNavigationOptions = {
  headerShown: true,
  headerTransparent: Platform.OS === 'ios',
  headerShadowVisible: false,
  headerStyle: { backgroundColor: Platform.OS === 'ios' ? 'transparent' : cores.fundo.tela },
  headerTintColor: cores.tint,
  headerTitleStyle: { color: cores.texto.principal },
  headerBackTitle: 'Voltar',
  contentStyle: { backgroundColor: cores.fundo.tela },
};
