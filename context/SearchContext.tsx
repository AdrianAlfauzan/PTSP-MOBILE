// context/SearchContext.tsx
import React, { createContext, useContext, ReactNode } from 'react';
import { useGlobalSearch } from '@/hooks/Frontend/useGlobalSearch';

interface SearchContextProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
}

const SearchContext = createContext<SearchContextProps>({
  searchQuery: '',
  setSearchQuery: () => {},
  clearSearch: () => {},
});

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  // Gunakan useGlobalSearch hanya untuk mengelola query (data = [])
  const {
    searchQuery,
    updateSearchQuery: setSearchQuery,
    clearSearch,
  } = useGlobalSearch([]);

  return (
    <SearchContext.Provider
      value={{ searchQuery, setSearchQuery, clearSearch }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);
