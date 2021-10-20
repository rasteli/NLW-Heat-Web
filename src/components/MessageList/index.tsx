import { useEffect, useState } from "react"
import { io } from "socket.io-client"

import styles from "./styles.module.scss"
import logo from "../../assets/logo.svg"
import { api } from "../../services/api"

type Message = {
  id: string
  text: string
  user: {
    login: string
    avatar_url: string
  }
}

const messagesQueue: Message[] = []
const socket = io("http://localhost:3333")

socket.on("new_message", (newMessage: Message) => {
  messagesQueue.push(newMessage)
})

export function MessageList() {
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    setInterval(() => {
      if (messagesQueue.length > 0) {
        setMessages(prevMessages =>
          [messagesQueue[0], prevMessages[0], prevMessages[1]].filter(Boolean)
        )

        messagesQueue.shift()
      }
    }, 3000)
  }, [])

  useEffect(() => {
    async function getMessages() {
      const response = await api.get<Message[]>("/messages/last3")
      setMessages(response.data)
    }

    getMessages()
  }, [])

  return (
    <div className={styles.messageListWrapper}>
      <img src={logo} alt="DoWhile 2021" />

      <ul className={styles.messageList}>
        {messages.map(message => (
          <li className={styles.message} key={message.id}>
            <p className={styles.messageContent}>{message.text}</p>
            <div className={styles.messageUser}>
              <div className={styles.userImage}>
                <img src={message.user.avatar_url} alt="User avatar" />
              </div>
              <span>{message.user.login}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
