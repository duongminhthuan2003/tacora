import './App.css'
import HomePage from './pages/HomePage.tsx'
import SettingsPage from './pages/SettingsPage.tsx'
import TasksPage from './pages/TasksPage.tsx'
import NavigationBar from "./components/NavigationBar.tsx";
import { AnimatePresence } from "framer-motion";
import { Routes, Route } from 'react-router-dom';
import SearchPage from "./pages/SearchPage.tsx";

function App() {
  return (
    <div className="m-4">
        <NavigationBar />

        <div>
            <AnimatePresence>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/tasks" element={<TasksPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/search" element={<SearchPage />} />
                </Routes>
            </AnimatePresence>
        </div>
    </div>
  )
}

export default App
