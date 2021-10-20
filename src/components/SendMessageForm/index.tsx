import { useState, FormEvent } from "react"
import { VscGithubInverted, VscSignOut } from "react-icons/vsc"

import { api } from "../../services/api"
import { useAuth } from "../../contexts/AuthContext"
import styles from "./styles.module.scss"

export function SendMessageForm() {
  const { user, signOut } = useAuth()
  const [message, setMessage] = useState("")

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (!message.trim()) return

    await api.post("/messages", { message })
    setMessage("")
  }

  return (
    <div className={styles.sendMessageFormWrapper}>
      <button className={styles.signOutButton} onClick={signOut}>
        <VscSignOut size="32" />
      </button>

      <header className={styles.userInfo}>
        <div className={styles.userImage}>
          <img src={user?.avatar_url} alt="User avatar" />
        </div>
        <strong className={styles.userName}>{user?.name}</strong>
        <span className={styles.userGithub}>
          <VscGithubInverted size="16" />
          {user?.login}
        </span>
      </header>

      <form onSubmit={handleSubmit} className={styles.sendMessageForm}>
        <label htmlFor="message">Mensagem</label>
        <textarea
          name="message"
          id="message"
          placeholder="Qual sua expectativa para o evento?"
          onChange={e => setMessage(e.target.value)}
          value={message}
        />
        <button type="submit">Enviar mensagem</button>
      </form>
    </div>
  )
}
