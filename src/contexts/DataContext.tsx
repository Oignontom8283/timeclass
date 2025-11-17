import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { rawScheduleSchema, type ScheduleType } from '../utils/schemas';
  
interface DataContextType {
  schools: ScheduleType[]
  loading: boolean
  error: Error | null
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<ScheduleType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const effect = async () => {
      setLoading(true);
      try {
        // Fetch the list of schools
        const schoolsList = await fetch('/schools.json')
          .then(res => res.json() as Promise<string[]>)
          .catch(err => { throw new Error(`Failed to fetch data: ${err.message}`) });

        // Fetch and validate each school's data
        const schools: ScheduleType[] = (await Promise.all(schoolsList.map(async schoolId => {
          
          // Fetch individual school data
          const response = await fetch(`/schools/${schoolId}.json`)
            .then(res => res.json())
            .catch(err => { console.error(`Failed to fetch data for school ${schoolId}: ${err.message}`); return null; });

          // Parse and validate the fetched data
          const validatedData = rawScheduleSchema.safeParse(response);

          // If validation fails, log the error and skip this entry
          if (!validatedData.success) { 
            console.error(`Validation failed for school ${schoolId}:`, validatedData.error);
            return null;
          }

          return { ...validatedData.data, id: schoolId, scheduleAll: [validatedData.data.scheduleStart, ...validatedData.data.schedule] }; // Return data with added id field
        }))).filter(school => school != null);

        // Update state with the fetched and validated data
        setData(schools);

      } catch (err) {
        // Handle any unexpected errors
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setData([]);
      } finally {
        // Always set loading to false at the end
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
