import styled from 'styled-components/native'
import { RFValue } from 'react-native-responsive-fontsize'
import { ScrollView } from 'react-native'
import { Feather } from '@expo/vector-icons'

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`

export const Header = styled.View`
  background-color: ${({ theme }) => theme.colors.primary};
  width: 100%;
  height: ${RFValue(113)}px;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 19px;
`

export const Title = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${RFValue(18)}px;
  color: ${({ theme }) => theme.colors.shape};
`
export const Content = styled(ScrollView).attrs({
  contentContainerStyle: { padding: 24 },
})`
  margin-bottom: auto;
`

export const ChartContainer = styled.View`
  width: 100%;
  align-items: center;
`
export const MonthSelect = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  margin-top: 24px;
`

export const MonthSelectButton = styled.TouchableOpacity``

export const SelectIcon = styled(Feather)`
  font-size: ${RFValue(24)}px;
`

export const Month = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${RFValue(20)}px;
`
