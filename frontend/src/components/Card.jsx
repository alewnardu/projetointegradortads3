import React from 'react';
import './Card.css';

export function Card({ children, className = '', hoverable = false, ...props }) {
  return (
    <div 
      className={`card ${hoverable ? 'card-hoverable' : ''} ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
}
