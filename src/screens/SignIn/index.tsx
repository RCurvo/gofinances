import React, { useState } from 'react'
import {
  Container,
  Header,
  Title,
  TitleWrapper,
  SignInTitle,
  Footer,
  FooterWrapper,
} from './styles'
import Google from '../../assets/google.svg'
import Apple from '../../assets/apple.svg'
import Logo from '../../assets/logo.svg'
import { RFValue } from 'react-native-responsive-fontsize'
import { SignInSocialButton } from '../../components/SignInSocialButton'
import { useAuth } from '../../hooks/Auth'
import { ActivityIndicator, Alert, Platform } from 'react-native'
import { useTheme } from 'styled-components'

export function SignIn() {
  const [isLoading, setIsLoading] = useState(false)
  const { SignInWithGoogle } = useAuth()
  const { colors } = useTheme()

  async function handleSignInWithGoogle() {
    try {
      setIsLoading(true)
      return await SignInWithGoogle()
    } catch (error) {
      Alert.alert('Não foi possível conectar a conta Google')
      setIsLoading(false)
    }
  }

  return (
    <Container style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Header>
        <TitleWrapper>
          <Logo width={RFValue(120)} height={RFValue(68)} />
          <Title>
            Controle suas {'\n'} finanças de forma {'\n'} muito simples
          </Title>
        </TitleWrapper>
        <SignInTitle>
          Faça seu login com{'\n'} uma das contas abaixo
        </SignInTitle>
      </Header>
      <Footer>
        <FooterWrapper>
          <SignInSocialButton
            title="Entrar com Google"
            svg={Google}
            onPress={handleSignInWithGoogle}
          />
          {Platform.OS === 'ios' && (
            <SignInSocialButton title="Entrar com Apple" svg={Apple} />
          )}
        </FooterWrapper>
        {isLoading && (
          <ActivityIndicator
            color={colors.shape}
            size={24}
            style={{ marginTop: 18 }}
          />
        )}
      </Footer>
    </Container>
  )
}
