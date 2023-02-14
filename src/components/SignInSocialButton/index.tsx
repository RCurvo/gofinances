import React from 'react'
import { TouchableOpacityProps } from 'react-native'
import { SvgProps } from 'react-native-svg'
import { Button, ImageContainer, Title } from './styles'

interface Props extends TouchableOpacityProps {
  title: string
  svg: React.FC<SvgProps>
}

export function SignInSocialButton({
  title,
  svg: Svg,
  activeOpacity,
  ...rest
}: Props) {
  return (
    <Button activeOpacity={0.925} {...rest}>
      <ImageContainer>
        <Svg />
      </ImageContainer>
      <Title>{title}</Title>
    </Button>
  )
}
