/**
 * usePagination - Custom Hook for Pagination Logic
 *
 * This hook manages pagination state and provides helper functions
 * for navigating through pages of data.
 *
 * Key learning points:
 * - Custom hooks encapsulate reusable logic
 * - Math.ceil calculates total pages from items
 * - Boundary checks prevent invalid page navigation
 * - Computed values (indices) are derived from state
 */

import { useState, useMemo } from 'react';

/**
 * Interface for the pagination hook parameters
 */
interface UsePaginationProps {
  totalItems: number;
  itemsPerPage?: number;
  initialPage?: number;
}

/**
 * Interface for the return value of the pagination hook
 */
interface UsePaginationReturn {
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  itemsOnCurrentPage: number;
  setPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  canNextPage: boolean;
  canPrevPage: boolean;
}

/**
 * usePagination Hook
 *
 * @param totalItems - Total number of items to paginate
 * @param itemsPerPage - Number of items per page (default: 10)
 * @param initialPage - Starting page number (default: 1)
 * @returns Pagination state and navigation functions
 */
export function usePagination({
  totalItems,
  itemsPerPage = 10,
  initialPage = 1,
}: UsePaginationProps): UsePaginationReturn {
  // State: Current page number (1-based)
  // I'm using Math.max to ensure we start at page 1 minimum
  const [currentPage, setCurrentPage] = useState<number>(
    Math.max(1, initialPage)
  );

  /**
   * Calculate total pages needed
   *
   * I learned that Math.ceil rounds up, which is perfect for pagination
   * because even 1 extra item needs a new page.
   * For example: 25 items / 10 per page = 2.5 → rounds to 3 pages
   */
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalItems / itemsPerPage));
  }, [totalItems, itemsPerPage]);

  /**
   * Calculate start index (0-based) for current page
   *
   * Formula: (currentPage - 1) * itemsPerPage
   * Example: Page 1 → (1-1) * 10 = 0 (items 0-9)
   *          Page 2 → (2-1) * 10 = 10 (items 10-19)
   */
  const startIndex = useMemo(() => {
    return (currentPage - 1) * itemsPerPage;
  }, [currentPage, itemsPerPage]);

  /**
   * Calculate end index (0-based, exclusive) for current page
   *
   * I'm using Math.min to handle the last page correctly.
   * If the last page has fewer items, endIndex won't exceed totalItems.
   *
   * Example with 25 items, 10 per page:
   * - Page 1: min(10, 25) = 10 (items 0-9)
   * - Page 2: min(20, 25) = 20 (items 10-19)
   * - Page 3: min(30, 25) = 25 (items 20-24) ← last page has 5 items
   */
  const endIndex = useMemo(() => {
    return Math.min(startIndex + itemsPerPage, totalItems);
  }, [startIndex, itemsPerPage, totalItems]);

  /**
   * Calculate actual number of items on current page
   *
   * This is useful for displaying "Showing X items" messages
   * Most pages will have itemsPerPage items, but the last page might have fewer
   */
  const itemsOnCurrentPage = useMemo(() => {
    return endIndex - startIndex;
  }, [endIndex, startIndex]);

  /**
   * Boolean flags for enabling/disabling navigation buttons
   *
   * canPrevPage: false when on first page
   * canNextPage: false when on last page
   */
  const canPrevPage = currentPage > 1;
  const canNextPage = currentPage < totalPages;

  /**
   * setPage Function
   *
   * Sets the current page to a specific page number.
   * I'm using Math.max and Math.min to clamp the value
   * between 1 and totalPages, preventing invalid page numbers.
   */
  const setPage = (page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
  };

  /**
   * nextPage Function
   *
   * Advances to the next page if possible.
   * The check prevents going beyond the last page.
   */
  const nextPage = () => {
    if (canNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  /**
   * prevPage Function
   *
   * Goes back to the previous page if possible.
   * The check prevents going below page 1.
   */
  const prevPage = () => {
    if (canPrevPage) {
      setCurrentPage(prev => prev - 1);
    }
  };

  // Return all pagination state and functions
  return {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    itemsOnCurrentPage,
    setPage,
    nextPage,
    prevPage,
    canNextPage,
    canPrevPage,
  };
}
