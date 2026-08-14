import React from 'react';

function Button({ children, className, onClick, type = 'submit', ...rest }) {
  return (
    <button onClick={onClick} className={className} type={type} {...rest}>
      {children}
    </button>
  );
}

export default Button;
