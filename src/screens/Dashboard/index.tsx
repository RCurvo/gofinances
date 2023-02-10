import { useCallback, useEffect, useState } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { HighlightCard } from '../../components/HighlightCard'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  TransactionCard,
  TransactionCardProps,
} from '../../components/TransactionCard'
import {
  Container,
  Header,
  UserInfo,
  UserWrapper,
  Photo,
  User,
  UserGreeting,
  UserName,
  Icon,
  HighLightCards,
  Transactions,
  Title,
  TransactionList,
  LogoutButton,
} from './styles'
import { useFocusEffect } from '@react-navigation/native'
import { ActivityIndicator } from 'react-native'
import { LastTransaction } from '../../components/HighlightCard/styles'

export interface DataListProps extends TransactionCardProps {
  id: string
}

interface HilightProps {
  amount: string
  lastTransaction: string
}

interface HighlightData {
  entries: HilightProps
  expenses: HilightProps
  total: HilightProps
}

const dataKey = '@gofinances:transactions'

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<DataListProps[]>([])
  const [HighlightData, setHighlightData] = useState<HighlightData>()

  function getLastTransactionDate(
    collection: DataListProps[],
    type: 'up' | 'down',
  ) {
    const lastTransaction = new Date(
      Math.max.apply(
        Math,
        collection
          .filter((transaction) => transaction.type === type)
          .map((transaction) => new Date(transaction.date).getTime()),
      ),
    )
    return Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: '2-digit',
    }).format(lastTransaction)
  }

  async function loadTransactions() {
    setIsLoading(true)
    const response = await AsyncStorage.getItem(dataKey)
    const transactions = response ? JSON.parse(response) : []

    let entriesTotal = 0
    let expenseTotal = 0

    const transactionsFormated: DataListProps[] = transactions.map(
      (item: DataListProps) => {
        if (item.type === 'up') {
          entriesTotal += Number(item.amount)
        }
        if (item.type === 'down') {
          expenseTotal += Number(item.amount)
        }
        const amount = Number(item.amount).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })
        const date = Intl.DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        }).format(new Date(item.date))
        return {
          id: item.id,
          name: item.name,
          amount,
          date,
          type: item.type,
          category: item.category,
        }
      },
    )
    const lastTransactionEntries = getLastTransactionDate(transactions, 'up')
    const lastTransactionExpenses = getLastTransactionDate(transactions, 'down')
    const totalInterval = `01 a ${Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: '2-digit',
    }).format(new Date())}`

    setHighlightData({
      entries: {
        amount: entriesTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        lastTransaction: `Última entrada dia ${lastTransactionEntries}`,
      },
      expenses: {
        amount: expenseTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        lastTransaction: `Última saída dia ${lastTransactionExpenses}`,
      },
      total: {
        amount: (entriesTotal - expenseTotal).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        lastTransaction: totalInterval,
      },
    })
    setData(transactionsFormated)

    setIsLoading(false)
  }

  useFocusEffect(
    useCallback(() => {
      loadTransactions()
    }, []),
  )

  // const data: DataListProps[] = [
  //   {
  //     id: '1',
  //     type: 'positive',
  //     title: 'Desenvolvimento de site',
  //     amount: 'R$ 12.000,00',
  //     category: { name: 'Vendas', icon: 'dollar-sign' },
  //     date: '13/04/2022',
  //   },
  //   {
  //     id: '2',
  //     type: 'negative',
  //     title: 'Hamburguer',
  //     amount: 'R$59,00',
  //     category: { name: 'Alimentação', icon: 'coffee' },
  //     date: '10/04/2022',
  //   },
  //   {
  //     id: '3',
  //     type: 'negative',
  //     title: 'Aluguel',
  //     amount: 'R$ 1.200,00',
  //     category: { name: 'Casa', icon: 'shopping-bag' },
  //     date: '10/04/2022',
  //   },
  // ]
  return (
    <Container>
      {isLoading ? (
        <ActivityIndicator
          size="large"
          style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}
        />
      ) : (
        <>
          <Header>
            <UserWrapper>
              <UserInfo>
                <Photo source={{ uri: 'https://github.com/rcurvo.png' }} />
                <User>
                  <UserGreeting>Olá</UserGreeting>
                  <UserName>Rodrigo</UserName>
                </User>
              </UserInfo>
              <GestureHandlerRootView>
                <LogoutButton>
                  <Icon name="power" />
                </LogoutButton>
              </GestureHandlerRootView>
            </UserWrapper>
          </Header>
          <HighLightCards>
            <HighlightCard
              type="up"
              title="Entradas"
              amount={HighlightData?.entries.amount}
              lastTransaction={HighlightData?.entries.lastTransaction}
            />
            <HighlightCard
              type="down"
              title="Saídas"
              amount={HighlightData?.expenses.amount}
              lastTransaction={HighlightData?.expenses.lastTransaction}
            />
            <HighlightCard
              type="total"
              title="Total"
              amount={HighlightData?.total.amount}
              lastTransaction={HighlightData?.total.lastTransaction}
            />
          </HighLightCards>
          <Transactions>
            <Title>Listagem</Title>
            <TransactionList
              data={data}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <TransactionCard data={item} />}
              showsVerticalScrollIndicator={false}
            />
          </Transactions>
        </>
      )}
    </Container>
  )
}
