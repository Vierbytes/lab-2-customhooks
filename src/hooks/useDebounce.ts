/**
 * useDebounce - Custom Hook for Debouncing Values
 *
 * This hook delays updating a value until after a specified delay period
 * has passed without the value changing. This is useful for:
 * - Search inputs (avoid API calls on every keystroke)
 * - Form validation
 * - Resize/scroll handlers
 *
 * Key learning points:
 * - useEffect with cleanup prevents memory leaks
 * - setTimeout delays the state update
 * - clearTimeout cancels pending updates when value changes
 * - Debouncing improves performance by reducing unnecessary operations
 */

import { useState, useEffect } from 'react';

/**
 * useDebounce Hook
 *
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds (default: 500ms)
 * @returns The debounced value
 *
 * Example usage:
 * ```typescript
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearch = useDebounce(searchTerm, 500);
 *
 * useEffect(() => {
 *   // This only runs 500ms after the user stops typing
 *   fetchSearchResults(debouncedSearch);
 * }, [debouncedSearch]);
 * ```
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  /**
   * State: The debounced value
   *
   * This starts with the initial value and gets updated
   * only after the delay period without changes.
   */
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  /**
   * Effect: Set up the debounce timer
   *
   * This effect runs whenever `value` or `delay` changes.
   * It schedules an update to debouncedValue after the delay period.
   *
   * The cleanup function is CRITICAL - it cancels the pending timer
   * if the value changes before the delay expires. This is what makes
   * it "debounce" instead of just "delay".
   *
   * How it works:
   * 1. User types "a" → timer starts (500ms countdown)
   * 2. User types "ab" (within 500ms) → cleanup cancels first timer, new timer starts
   * 3. User types "abc" (within 500ms) → cleanup cancels second timer, new timer starts
   * 4. User stops typing → timer completes after 500ms → debouncedValue updates to "abc"
   */
  useEffect(() => {
    // Set up a timer to update the debounced value after the delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    /**
     * Cleanup function
     *
     * This runs BEFORE the effect runs again (when value/delay changes)
     * and when the component unmounts.
     *
     * I learned that clearing the timeout is essential because:
     * - Without it, every value change would schedule a new timer
     * - Old timers would still fire, causing multiple updates
     * - This would defeat the purpose of debouncing
     */
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Re-run effect when value or delay changes

  // Return the debounced value
  return debouncedValue;
}
