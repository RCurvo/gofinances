/* eslint-disable camelcase */
import 'react-native-gesture-handler'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import 'intl'
import 'intl/locale-data/jsonp/pt-BR'

import { ThemeProvider } from 'styled-components'
import AppLoading from 'expo-app-loading'
import theme from './src/styles/theme'
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins'
import { AuthProvider } from './src/hooks/Auth'
import { Routes } from './src/routes'

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  })

  if (!fontsLoaded) {
    return <AppLoading />
  }

  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Routes />
      </AuthProvider>

      <StatusBar style="light" />
    </ThemeProvider>
  )
}
