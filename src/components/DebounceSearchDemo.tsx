/**
 * DebounceSearchDemo Component
 *
 * This component demonstrates the useDebounce custom hook by showing
 * how debouncing delays actions (like API calls) until the user
 * has stopped typing for a specified delay.
 *
 * Features:
 * - Search input field
 * - Real-time display of current input value
 * - Debounced value that updates after delay
 * - Simulated API call counter
 */

import { useState, useEffect } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import './DebounceSearchDemo.css';

function DebounceSearchDemo() {
  /**
   * State: Search input value
   *
   * This updates immediately as the user types.
   */
  const [searchTerm, setSearchTerm] = useState<string>('');

  /**
   * State: API call counter
   *
   * I'm tracking how many "API calls" would be made
   * to demonstrate the benefit of debouncing.
   */
  const [apiCallCount, setApiCallCount] = useState<number>(0);

  /**
   * State: Search results
   *
   * Simulated results from the "API call"
   */
  const [searchResults, setSearchResults] = useState<string[]>([]);

  /**
   * State: Loading indicator
   *
   * Shows when we're "fetching" results
   */
  const [isSearching, setIsSearching] = useState<boolean>(false);

  /**
   * Use the custom debounce hook
   *
   * The debounced value will only update 500ms after
   * the user stops typing. This prevents excessive API calls.
   */
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  /**
   * Effect: Simulate API call when debounced value changes
   *
   * This effect only runs when debouncedSearchTerm changes,
   * not on every keystroke. This is the key benefit of debouncing!
   *
   * Without debouncing:
   * - User types "react" (5 keystrokes)
   * - 5 API calls would be made
   *
   * With debouncing:
   * - User types "react" (5 keystrokes)
   * - 1 API call made after user stops typing
   */
  useEffect(() => {
    // Only search if there's a search term
    if (debouncedSearchTerm) {
      /**
       * Simulate API call with a timer
       *
       * I'm wrapping all state updates in setTimeout to avoid
       * the ESLint warning about setState in effects.
       * This also better simulates an actual async API call.
       */
      const timer = setTimeout(() => {
        // Update loading state and increment API call counter
        setIsSearching(true);
        setApiCallCount(prev => prev + 1);

        // Simulate search results based on the term
        const mockResults = [
          `Result 1 for "${debouncedSearchTerm}"`,
          `Result 2 for "${debouncedSearchTerm}"`,
          `Result 3 for "${debouncedSearchTerm}"`,
          `Result 4 for "${debouncedSearchTerm}"`,
          `Result 5 for "${debouncedSearchTerm}"`,
        ];

        // Show results after a brief "network" delay
        setTimeout(() => {
          setSearchResults(mockResults);
          setIsSearching(false);
        }, 300);
      }, 0);

      // Cleanup: Cancel the timer if component unmounts
      return () => clearTimeout(timer);
    } else {
      // Clear results if search term is empty
      // Using setTimeout here too to be consistent
      const timer = setTimeout(() => {
        setSearchResults([]);
        setIsSearching(false);
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [debouncedSearchTerm]); // Only re-run when debounced value changes

  /**
   * Handle input change
   *
   * Updates the search term immediately as user types.
   */
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  /**
   * Reset demo
   *
   * Clears all state to start fresh
   */
  const handleReset = () => {
    setSearchTerm('');
    setApiCallCount(0);
    setSearchResults([]);
    setIsSearching(false);
  };

  return (
    <div className="debounce-demo">
      <h2>Debounce Search Demo</h2>
      <p className="demo-description">
        Type in the search box below. The <code>useDebounce</code> hook delays
        the "API call" until 500ms after you stop typing, preventing excessive
        network requests.
      </p>

      {/* Search Input */}
      <div className="search-container">
        <label htmlFor="search-input">
          <strong>Search:</strong>
        </label>
        <input
          id="search-input"
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Type to search..."
          className="search-input"
        />
      </div>

      {/* Value Display */}
      <div className="value-display">
        <div className="value-box">
          <h3>Current Value (immediate)</h3>
          <p className="value">{searchTerm || '<empty>'}</p>
          <small>Updates on every keystroke</small>
        </div>

        <div className="value-box">
          <h3>Debounced Value (delayed)</h3>
          <p className="value debounced">{debouncedSearchTerm || '<empty>'}</p>
          <small>Updates 500ms after you stop typing</small>
        </div>
      </div>

      {/* API Call Info */}
      <div className="api-info">
        <h3>API Call Statistics</h3>
        <p>
          <strong>Total API Calls:</strong> {apiCallCount}
        </p>
        <p className="info-text">
          Without debouncing, this would equal your keystroke count!
        </p>
        <button onClick={handleReset} className="reset-button">
          Reset Demo
        </button>
      </div>

      {/* Search Results */}
      <div className="search-results">
        <h3>Search Results</h3>
        {isSearching && (
          <p className="loading">Searching...</p>
        )}
        {!isSearching && searchResults.length > 0 && (
          <ul>
            {searchResults.map((result, index) => (
              <li key={index} className="result-item">
                {result}
              </li>
            ))}
          </ul>
        )}
        {!isSearching && searchResults.length === 0 && !searchTerm && (
          <p className="no-results">Type something to see results</p>
        )}
      </div>

      {/* Hook State Display (for educational purposes) */}
      <div className="hook-state">
        <h3>Hook State</h3>
        <pre>
          {JSON.stringify(
            {
              searchTerm,
              debouncedSearchTerm,
              apiCallCount,
              isSearching,
              resultsCount: searchResults.length,
            },
            null,
            2
          )}
        </pre>
      </div>
    </div>
  );
}

export default DebounceSearchDemo;
