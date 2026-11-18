import { Stack } from 'expo-router';

import { cabecalhoTituloGrande } from '@/navegacao/cabecalho';

export default function Layout() {
  return (
    <Stack screenOptions={cabecalhoTituloGrande}>
      <Stack.Screen name="ajustes" options={{ title: 'Ajustes' }} />
    </Stack>
  );
}
