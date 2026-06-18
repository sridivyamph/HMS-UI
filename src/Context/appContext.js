import React, { createContext, useContext, useState, useMemo } from 'react';

const AppContext = createContext({});

const AppProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  // Memoize the value to avoid re-creating the object on every render
  const appContextValue = useMemo(
    () => ({
      isLoading,
      setIsLoading: () => setIsLoading((preValue) => !preValue),
    }),
    [isLoading]
  );

  return <AppContext.Provider value={appContextValue}>{children}</AppContext.Provider>;
};

const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within a AppProvider');
  }
  return context;
};

export { AppProvider, useAppContext };
