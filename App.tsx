/* eslint-disable camelcase */
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { Register } from './src/screens/Register'
import { ThemeProvider } from 'styled-components'
import AppLoading from 'expo-app-loading'
import theme from './src/styles/theme'
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins'

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
      <Register />
      <StatusBar style="light" />
    </ThemeProvider>
  )
}
