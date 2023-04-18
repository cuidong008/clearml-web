import React from "react"
import "@/i18n"
import ReactDOM from "react-dom/client"
import { App } from "./App"
import store from "@/store"
import "@/styles/index.scss"
import { reportWebVitals } from "@/reportWebVitals"
import { Provider } from "react-redux"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)
reportWebVitals(console.log)
