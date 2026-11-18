import { Stack } from 'expo-router';

import { cabecalhoTituloGrande } from '@/navegacao/cabecalho';

export default function Layout() {
  return (
    <Stack screenOptions={cabecalhoTituloGrande}>
      <Stack.Screen name="perto" options={{ title: 'Perto de mim' }} />
    </Stack>
  );
}
