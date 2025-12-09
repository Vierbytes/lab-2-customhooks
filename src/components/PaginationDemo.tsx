/**
 * PaginationDemo Component
 *
 * This component demonstrates the usePagination custom hook by displaying
 * a paginated list of items with navigation controls.
 *
 * Features:
 * - Shows current page and total pages
 * - Displays items for the current page
 * - Previous/Next buttons (disabled appropriately)
 * - Direct page number buttons
 */

import { usePagination } from '../hooks/usePagination';
import './PaginationDemo.css';

function PaginationDemo() {
  /**
   * Sample data: An array of 47 items to paginate
   *
   * I'm creating this data to demonstrate pagination with an incomplete last page.
   * With 10 items per page, 47 items will give us:
   * - Page 1: 10 items (0-9)
   * - Page 2: 10 items (10-19)
   * - Page 3: 10 items (20-29)
   * - Page 4: 10 items (30-39)
   * - Page 5: 7 items (40-46) ← incomplete page
   */
  const sampleItems = Array.from({ length: 47 }, (_, index) => ({
    id: index + 1,
    name: `Item ${index + 1}`,
    description: `This is the description for item ${index + 1}`,
  }));

  /**
   * Use the custom pagination hook
   *
   * I'm setting itemsPerPage to 10 and starting at page 1.
   * The hook will manage all pagination logic for us.
   */
  const {
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
  } = usePagination({
    totalItems: sampleItems.length,
    itemsPerPage: 10,
    initialPage: 1,
  });

  /**
   * Get items for the current page
   *
   * I'm using slice() with the startIndex and endIndex
   * from the pagination hook to extract the correct items.
   */
  const currentItems = sampleItems.slice(startIndex, endIndex);

  /**
   * Generate page number buttons
   *
   * This creates an array of page numbers [1, 2, 3, 4, 5]
   * which we can map to buttons.
   */
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="pagination-demo">
      <h2>Pagination Demo</h2>
      <p className="demo-description">
        This demo shows how the <code>usePagination</code> hook manages pagination
        state and provides navigation functions.
      </p>

      {/* Pagination Info */}
      <div className="pagination-info">
        <p>
          <strong>Page {currentPage} of {totalPages}</strong>
        </p>
        <p>
          Showing items {startIndex + 1}-{endIndex} of {sampleItems.length}
        </p>
        <p>
          Items on this page: {itemsOnCurrentPage}
        </p>
      </div>

      {/* Items List */}
      <div className="items-list">
        <h3>Current Page Items</h3>
        <ul>
          {currentItems.map(item => (
            <li key={item.id} className="item-card">
              <strong>{item.name}</strong>
              <p>{item.description}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Navigation Controls */}
      <div className="pagination-controls">
        {/* Previous Button */}
        <button
          onClick={prevPage}
          disabled={!canPrevPage}
          className="nav-button"
          title="Go to previous page"
        >
          ← Previous
        </button>

        {/* Page Number Buttons */}
        <div className="page-numbers">
          {pageNumbers.map(pageNum => (
            <button
              key={pageNum}
              onClick={() => setPage(pageNum)}
              className={`page-button ${pageNum === currentPage ? 'active' : ''}`}
              title={`Go to page ${pageNum}`}
            >
              {pageNum}
            </button>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={nextPage}
          disabled={!canNextPage}
          className="nav-button"
          title="Go to next page"
        >
          Next →
        </button>
      </div>

      {/* Hook State Display (for educational purposes) */}
      <div className="hook-state">
        <h3>Hook State</h3>
        <pre>
          {JSON.stringify(
            {
              currentPage,
              totalPages,
              startIndex,
              endIndex,
              itemsOnCurrentPage,
              canNextPage,
              canPrevPage,
            },
            null,
            2
          )}
        </pre>
      </div>
    </div>
  );
}

export default PaginationDemo;
