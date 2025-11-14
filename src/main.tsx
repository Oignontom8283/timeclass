import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import School from './pages/School';
import Timestamp from './pages/Timestamp';
import { DataProvider } from './contexts/DataContext';
import Layout from './components/Layout';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DataProvider>
      <BrowserRouter>
        <Routes>

          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path='school/:id' element={<School />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path='school/:schoolId/timestamp/:timestampId' element={<Timestamp />} />
          
        </Routes>
      </BrowserRouter>
    </DataProvider>
  </StrictMode>,
)
