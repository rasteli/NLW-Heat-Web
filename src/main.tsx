import React from "react"
import ReactDOM from "react-dom"
import { AuthProvider } from "./contexts/AuthContext"
import { App } from "./App"

import "./styles/global.css"

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById("root")
)
