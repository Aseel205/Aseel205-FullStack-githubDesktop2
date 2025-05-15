import './Pagination.css';

type Props = {
    currentPage: number;
    totalPages: number;
    setPage: (page: number) => void;
  };
  
  function Pagination({ currentPage, totalPages, setPage }: Props) {
    const MAX_PAGE_BUTTONS = 5;
  
    const getPageNumbers = () => {
      if (totalPages <= MAX_PAGE_BUTTONS) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
      }
  
      if (currentPage < 3) return [1, 2, 3, 4, 5];
      if (currentPage > totalPages - 2) {
        return Array.from({ length: 5 }, (_, i) => totalPages - 4 + i);
      }
  
      return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
    };
  
    const handleClick = (page: number) => {
      console.log(" handle click with page :" + page )
      if (page >= 1 && page <= totalPages) setPage(page);
      console.log(" the page now is :" +  page)
    };
  
    return (
      <nav className="pagination">
      <button name="first" onClick={() => handleClick(1)} disabled={currentPage === 1}>
          First
        </button>
        <button name="previous" onClick={() => handleClick(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
  
        {getPageNumbers().map((page) => (
          <button
            key={page}
            name={`page-${page}`}
            onClick={() => handleClick(page)}
            disabled={page === currentPage}
            style={{ fontWeight: page === currentPage ? 'bold' : 'normal' }}
          >
            {page}
          </button>
        ))}
  
        <button name="next" onClick={() => handleClick(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </button>
        <button name="last" onClick={() => handleClick(totalPages)} disabled={currentPage === totalPages}>
          Last
        </button>
        </nav>
    );
  }
  
  export default Pagination;
  