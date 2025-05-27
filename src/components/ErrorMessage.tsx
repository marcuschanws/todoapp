import { useEffect, useState } from 'react';
import '../App.css';

export const ErrorMessage = ({ message }: { message: string }) => {
  const [isVisible, setIsVisible] = useState(!!message);

  useEffect(() => {
    setIsVisible(!!message);
    const timer = setTimeout(() => setIsVisible(false), 5000);
    return () => clearTimeout(timer);
  }, [message]);

  return (
    <div className={`error-message ${isVisible ? 'visible' : ''}`}>
      {message}
    </div>
  );
};