import React from 'react';

export const PrintIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6 3.32a1 1 0 011-1h8a1 1 0 011 1l-.72 10.509m-7.5 0a42.415 42.415 0 0010.56 0m-10.56 0L6 18.32m0-4.5a42.415 42.415 0 0010.56 0m-10.56 0L6 18.32m0-4.5a42.415 42.415 0 0010.56 0m-10.56 0L6 18.32m-3.32-8.411a1 1 0 011.088-.891h12.464a1 1 0 011.088.891l.32 4.678a1 1 0 01-.891 1.088H4.891a1 1 0 01-.891-1.088l.32-4.678z"
    />
  </svg>
);
