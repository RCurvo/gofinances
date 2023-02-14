import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import * as AuthSession from 'expo-auth-session'
import AsyncStorage from '@react-native-async-storage/async-storage'

const { CLIENT_ID } = process.env
const { REDIRECT_URI } = process.env

interface AuthProviderProps {
  children: ReactNode
}

interface User {
  id: string
  name: string
  email: string
  photo?: string
}

interface IAuthContextData {
  user: User
  SignInWithGoogle(): Promise<void>
  sigInOut(): Promise<void>
  userStoredLoading: boolean
}

interface AuthorizationResponse {
  params: {
    access_token: string
  }
  type: string
}

const AuthContext = createContext({} as IAuthContextData)

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>({} as User)
  const [userStoredLoading, setUserStoredLoading] = useState(true)
  const userStorageKey = '@gofinances:user'

  async function SignInWithGoogle() {
    const RESPONSE_TYPE = 'token'
    const SCOPE = encodeURI('profile email')

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`

    const { type, params } = (await AuthSession.startAsync({
      authUrl,
    })) as AuthorizationResponse

    if (type === 'success') {
      const response = await fetch(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`,
      )
      const userInfo = await response.json()

      const userLogged = {
        id: userInfo.id,
        email: userInfo.email,
        name: userInfo.given_name,
        photo: userInfo.picture,
      }
      setUser(userLogged)
      await AsyncStorage.setItem(userStorageKey, JSON.stringify(userLogged))
    }
  }

  async function sigInOut() {
    setUser({} as User)
    await AsyncStorage.removeItem(userStorageKey)
  }

  useEffect(() => {
    async function loadUserStorageData() {
      const userStored = await AsyncStorage.getItem(userStorageKey)

      if (userStored) {
        const userLogged = JSON.parse(userStored) as User
        setUser(userLogged)
      }
      setUserStoredLoading(false)
    }
    loadUserStorageData()
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, SignInWithGoogle, sigInOut, userStoredLoading }}
    >
      {children}
    </AuthContext.Provider>
  )
}

function useAuth() {
  const context = useContext(AuthContext)
  return context
}

export { AuthProvider, useAuth }
