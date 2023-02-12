import React, { useCallback, useState } from 'react'
import { HistoryCard } from '../../components/HistoryCard'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from '@react-navigation/native'
import { categories } from '../../utils/categories'
import { VictoryPie } from 'victory-native'
import { RFValue } from 'react-native-responsive-fontsize'
import { useTheme } from 'styled-components'
import { ptBR } from 'date-fns/locale'

import {
  Container,
  Header,
  Title,
  Content,
  ChartContainer,
  MonthSelect,
  MonthSelectButton,
  SelectIcon,
  Month,
} from './styles'
import { addMonths, subMonths, format } from 'date-fns'

interface TransactionData {
  type: 'up' | 'down'
  name: string
  amount: string
  category: string
  date: string
}

interface CategoryData {
  name: string
  amount: string
  amountNumber: number
  color: string
  percent: string
}

export function Resume() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [totalByCategory, setTotalByCategory] = useState<CategoryData[]>([])

  const { colors } = useTheme()

  function handleChangeDate(action: 'next' | 'prev') {
    if (action === 'next') {
      const newDate = addMonths(selectedDate, 1)
      console.log(newDate)
      setSelectedDate(newDate)
    } else {
      const newDate = subMonths(selectedDate, 1)
      console.log(newDate)
      setSelectedDate(newDate)
    }
  }

  async function loadData() {
    const dataKey = '@gofinances:transactions'
    const response = await AsyncStorage.getItem(dataKey)
    const responseFormated: TransactionData[] = response
      ? JSON.parse(response)
      : []

    const expenses = responseFormated.filter(
      (expense) =>
        expense.type === 'down' &&
        new Date(expense.date).getMonth() === selectedDate.getMonth() &&
        new Date(expense.date).getFullYear() === selectedDate.getFullYear(),
    )

    const expensesTotal = expenses.reduce(
      (accumulator: number, expense: TransactionData) => {
        return accumulator + Number(expense.amount)
      },
      0,
    )

    const totalByCategory: CategoryData[] = []

    categories.forEach((category) => {
      let categorySum = 0
      expenses.forEach((expense) => {
        if (expense.category === category.key) {
          categorySum += Number(expense.amount)
        }
      })
      if (categorySum > 0) {
        const total = categorySum.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })

        const percent = `${((categorySum / expensesTotal) * 100).toFixed(0)}%`
        totalByCategory.push({
          name: category.name,
          color: category.color,
          amount: total,
          amountNumber: categorySum,
          percent,
        })
      }
    })
    setTotalByCategory(totalByCategory)
  }
  useFocusEffect(
    useCallback(() => {
      loadData()
    }, [selectedDate]),
  )
  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>
      <Content showsVerticalScrollIndicator={false}>
        <MonthSelect>
          <MonthSelectButton onPress={() => handleChangeDate('prev')}>
            <SelectIcon name="chevron-left" />
          </MonthSelectButton>
          <Month>{format(selectedDate, 'MMMM, yyyy', { locale: ptBR })}</Month>
          <MonthSelectButton onPress={() => handleChangeDate('next')}>
            <SelectIcon name="chevron-right" />
          </MonthSelectButton>
        </MonthSelect>
        <ChartContainer>
          <VictoryPie
            colorScale={totalByCategory.map((category) => category.color)}
            style={{
              labels: {
                fontSize: RFValue(18),
                fontWeight: 'bold',
                fill: colors.shape,
              },
            }}
            labelRadius={70}
            data={totalByCategory}
            x="percent"
            y="amountNumber"
          />
        </ChartContainer>

        {totalByCategory.map((item) => (
          <HistoryCard
            key={item.name}
            title={item.name}
            amount={item.amount}
            color={item.color}
          />
        ))}
      </Content>
    </Container>
  )
}
