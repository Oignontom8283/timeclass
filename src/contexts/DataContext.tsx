import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

interface DataContextType {
  schools: string[]
  loading: boolean
  error: Error | null
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [schools, setSchools] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        setLoading(true);
        const response = await fetch('/schools.json');
        if (!response.ok) {
          throw new Error(`Failed to fetch schools: ${response.statusText}`)
        }
        const data = await response.json();
        setSchools(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setSchools([]);
      } finally {
        setLoading(false);
      }
    }

    fetchSchools();
  }, []);

  return (
    <DataContext.Provider value={{ schools, loading, error }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
