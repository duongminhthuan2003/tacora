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
    <div className="fixed m-4 flex flex-col lg:flex-row gap-0 lg:gap-5 xl:gap-10">
        <div className="w-full lg:w-3/12 xl:w-2/12">
            <NavigationBar />
        </div>
        <div className="w-full lg:w-9/12 xl:w-10/12">
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
