import React from 'react';
import { Pagination } from 'semantic-ui-react';

const PaginationComponent = ({ totalPages, currentPage, onPageChange }) => {
  return (
    totalPages > 1 && (
      <div className='d-flex justify-content-center'>
        <Pagination
          boundaryRange={0}
          activePage={currentPage}
          ellipsisItem={{ content: '...', icon: 'ellipsis horizontal' }}
          firstItem={{ content: 'First', icon: 'angle double left' }}
          lastItem={{ content: 'Last', icon: 'angle double right' }}
          onPageChange={(e, { activePage }) => onPageChange(activePage)}
          prevItem={{ content: 'Prev', icon: 'angle left' }}
          nextItem={{ content: 'Next', icon: 'angle right' }}
          totalPages={totalPages}
          siblingRange={1}
        />
      </div>
    )
  );
};

export default PaginationComponent;