import {
  createContext,
  ReactNode,
  useEffect,
  useState,
  useContext
} from "react"
import { api } from "../services/api"

type User = {
  id: string
  name: string
  login: string
  avatar_url: string
}

type AuthResponse = {
  token: string
  user: User
}

type AuthContextData = {
  user: User | null
  signInURL: string
  signOut: () => void
}

type AuthProvider = {
  children: ReactNode
}

const AuthContext = createContext({} as AuthContextData)

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider(props: AuthProvider) {
  const [user, setUser] = useState<User | null>(null)

  const signInURL = `https://github.com/login/oauth/authorize?scope=user&client_id=${
    import.meta.env.VITE_GITHUB_CLIENT_ID
  }`

  async function signIn(code: string) {
    const response = await api.post<AuthResponse>("/authenticate", { code })
    const { token, user } = response.data

    localStorage.setItem("@dowhile:token", token)

    setUser(user)
  }

  function signOut() {
    setUser(null)
    localStorage.removeItem("@dowhile:token")
  }

  useEffect(() => {
    const url = window.location.href
    const hasCode = url.includes("?code=")

    if (hasCode) {
      const [urlWithoutCode, code] = url.split("?code=")

      window.history.pushState({}, "", urlWithoutCode)
      signIn(code)
    }
  }, [])

  useEffect(() => {
    async function setUserIfToken() {
      const token = localStorage.getItem("@dowhile:token")

      if (token) {
        api.defaults.headers.common.authorization = `Bearer ${token}`

        const response = await api.get<User>("/profile")

        setUser(response.data)
      }
    }

    setUserIfToken()
  }, [])

  const value: AuthContextData = {
    user,
    signOut,
    signInURL
  }

  return (
    <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
  )
}
