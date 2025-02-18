import { useEffect } from 'react';

const useCSSVariable = (variableName, value) => {
  useEffect(() => {
    document.documentElement.style.setProperty(variableName, value);
  }, [value, variableName]);
};

export default useCSSVariable;