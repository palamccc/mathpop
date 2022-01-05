import React from 'react';

export function LinkButton({
  url,
  children,
  type = 'primary',
}: {
  url: string;
  children?: React.ReactNode;
  type?: 'primary' | 'secondary';
}) {
  const bgColor = type === 'primary' ? 'bg-indigo-600' : 'bg-gray-600';
  return (
    <div className="rounded-md shadow">
      <a
        href={url}
        className={`w-full flex items-center justify-center px-8 py-3 text-xl font-medium rounded-md text-white ${bgColor}`}
      >
        {children}
      </a>
    </div>
  );
}

export function Button({
  onClick,
  children,
}: {
  onClick?: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-md shadow">
      <button
        className="w-full flex items-center justify-center px-8 py-3 text-xl font-medium rounded-md text-white bg-indigo-600"
        onClick={onClick}
      >
        {children}
      </button>
    </div>
  );
}
