import React from "react"
import { Router } from "react-router-dom"
import { Routes } from "./components/routes/routes"
import { history } from "./services/history"
import { theme } from "./theme"
import { ThemeProvider } from "emotion-theming"
import AppStateProvider from "./state"
import "./App.css"

function App() {
    return (
        <ThemeProvider theme={theme}>
            <AppStateProvider>
                <Router history={history}>
                    <Routes />
                </Router>
            </AppStateProvider>
        </ThemeProvider>
    )
}

export default App
