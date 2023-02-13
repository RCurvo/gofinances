import React from 'react'
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

export function SignIn() {
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
          <SignInSocialButton title="Entrar com Google" svg={Google} />
          <SignInSocialButton title="Entrar com Apple" svg={Apple} />
        </FooterWrapper>
      </Footer>
    </Container>
  )
}
