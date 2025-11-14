import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { rawScheduleSchema, type ScheduleType } from '../utils/schemas';
import zod from 'zod';

interface DataContextType {
  schools: ScheduleType[]
  loading: boolean
  error: Error | null
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const effect = async () => {
      setLoading(true);
      try {

        const schoolsList = await fetch('/schools.json') // Get the list of schools
          .then(res => res.json() as Promise<string[]>)
          .catch(err => { throw new Error(`Failed to fetch data: ${err.message}`) });

        const schools: ScheduleType[] = await Promise.all(schoolsList.map(async schoolId => {
          
          const response = await fetch(`/schools/${schoolId}.json`)
            .then(res => res.json())
            .catch(err => { console.error(`Failed to fetch data for school ${schoolId}: ${err.message}`); return null; });

          const validatedData = rawScheduleSchema.safeParse(response);

          if (!validatedData.success) {
            console.error(`Validation failed for school ${schoolId}:`, validatedData.error);
            return null;
          }

          return { ...validatedData.data, id: schoolId };
          
        }));

        setData(schools);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setData([]);
      } finally {
        setLoading(false);
      }
    }

    effect();
  }, []);

  return (
    <DataContext.Provider value={{ schools: data, loading, error }}>
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
