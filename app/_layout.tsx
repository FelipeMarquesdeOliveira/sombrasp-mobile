import Ionicons from '@expo/vector-icons/Ionicons';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { PreferenciasProvider } from '@/context/PreferenciasContext';
import { migrarBanco, NOME_BANCO } from '@/database';
import { cabecalhoSimples, cabecalhoTituloGrande } from '@/navegacao/cabecalho';
import { cores } from '@/theme';

export default function LayoutRaiz() {
  // Fonte de ícones do Android (no iPhone os ícones são SF Symbols do sistema).
  const [fontesCarregadas] = useFonts({ ...Ionicons.font });
  if (!fontesCarregadas) return <View style={{ flex: 1, backgroundColor: cores.fundo.tela }} />;

  return (
    <SafeAreaProvider>
      {/* Banco SQLite local: as tabelas são criadas/atualizadas em migrarBanco na abertura. */}
      <SQLiteProvider databaseName={NOME_BANCO} onInit={migrarBanco}>
        <PreferenciasProvider>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: cores.fundo.tela } }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="ponto/[id]" options={{ ...cabecalhoSimples, title: '' }} />
            <Stack.Screen name="guia-visual" options={{ ...cabecalhoTituloGrande, headerShown: true, title: 'Guia visual' }} />
          </Stack>
        </PreferenciasProvider>
      </SQLiteProvider>
    </SafeAreaProvider>
  );
}
