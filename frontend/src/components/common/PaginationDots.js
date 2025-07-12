import React from 'react';

const PaginationDots = ({ total, active }) => {
  return (
    <div className="pagination-dots text-center mt-4">
      {[...Array(total)].map((_, index) => (
        <span 
          key={index} 
          className={`dot ${index === active ? 'active' : ''}`}
        ></span>
      ))}
    </div>
  );
};

export default PaginationDots;