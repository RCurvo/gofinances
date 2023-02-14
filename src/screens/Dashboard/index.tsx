/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useState } from 'react'
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
import { useAuth } from '../../hooks/Auth'

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

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<DataListProps[]>([])
  const [HighlightData, setHighlightData] = useState<HighlightData>()

  const { sigInOut, user } = useAuth()
  const dataKey = `@gofinances:transactions_user:${user.id}`

  function getLastTransactionDate(
    collection: DataListProps[],
    type: 'up' | 'down',
  ) {
    const collectionFilttered = collection.filter(
      (transaction) => transaction.type === type,
    )

    if (collectionFilttered.length === 0) {
      return 0
    }
    const lastTransaction = new Date(
      Math.max.apply(
        Math,
        collectionFilttered.map((transaction) =>
          new Date(transaction.date).getTime(),
        ),
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
    }).format(new Date())}`

    setHighlightData({
      entries: {
        amount: entriesTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        lastTransaction:
          lastTransactionEntries === 0
            ? 'Não há transações'
            : `Última entrada dia ${lastTransactionEntries}`,
      },
      expenses: {
        amount: expenseTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        lastTransaction:
          lastTransactionExpenses === 0
            ? 'Não há transações'
            : `Última saída dia ${lastTransactionExpenses}`,
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
                <Photo source={{ uri: user.photo }} />
                <User>
                  <UserGreeting>Olá</UserGreeting>
                  <UserName>{user.name}</UserName>
                </User>
              </UserInfo>
              <GestureHandlerRootView>
                <LogoutButton onPress={sigInOut}>
                  <Icon name="power" />
                </LogoutButton>
              </GestureHandlerRootView>
            </UserWrapper>
          </Header>
          <HighLightCards>
            <HighlightCard
              type="up"
              title="Entradas"
              amount={HighlightData?.entries.amount!}
              lastTransaction={HighlightData?.entries.lastTransaction!}
            />
            <HighlightCard
              type="down"
              title="Saídas"
              amount={HighlightData?.expenses.amount!}
              lastTransaction={HighlightData?.expenses.lastTransaction!}
            />
            <HighlightCard
              type="total"
              title="Total"
              amount={HighlightData?.total.amount!}
              lastTransaction={HighlightData?.total.lastTransaction!}
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
