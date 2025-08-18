import React from 'react';

const arrowStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: '40%',
    zIndex: 2,
    width: '30px',
    height: '30px',
    backgroundColor: '#fff',
    borderRadius: '50%',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
    color: '#991f1f',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
};

export const CustomPrevArrow = ({ className, onClick }) => (
    <div className={className} onClick={onClick} style={{ ...arrowStyle, left: '-15px' }}>
        {'<'}
    </div>
);

export const CustomNextArrow = ({ className, onClick }) => (
    <div className={className} onClick={onClick} style={{ ...arrowStyle, right: '-15px' }}>
        {'>'}
    </div>
);
