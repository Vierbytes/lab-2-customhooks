/**
 * App Component - Main Entry Point
 *
 * This is the root component that displays both custom hook demos:
 * 1. PaginationDemo - demonstrates usePagination hook
 * 2. DebounceSearchDemo - demonstrates useDebounce hook
 */

import { useState } from 'react'
import PaginationDemo from './components/PaginationDemo'
import DebounceSearchDemo from './components/DebounceSearchDemo'
import './App.css'

function App() {
  /**
   * State: Active demo tab
   *
   * I'm using tabs to organize the demos and make it easy
   * to switch between them without scrolling.
   */
  const [activeTab, setActiveTab] = useState<'pagination' | 'debounce'>('pagination')

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <h1>Lab 2: Custom Hooks</h1>
        <p>Demonstrating reusable React custom hooks</p>
      </header>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          onClick={() => setActiveTab('pagination')}
          className={`tab-button ${activeTab === 'pagination' ? 'active' : ''}`}
        >
          Pagination Demo
        </button>
        <button
          onClick={() => setActiveTab('debounce')}
          className={`tab-button ${activeTab === 'debounce' ? 'active' : ''}`}
        >
          Debounce Demo
        </button>
      </div>

      {/* Demo Content */}
      <main className="demo-container">
        {activeTab === 'pagination' && <PaginationDemo />}
        {activeTab === 'debounce' && <DebounceSearchDemo />}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>Lab 2 - Custom Hooks Implementation</p>
      </footer>
    </div>
  )
}

export default App
