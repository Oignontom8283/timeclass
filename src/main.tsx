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
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<NotFound />} />
            <Route path='school/:id' element={<School />} />
            <Route path='timestamp/:id' element={<Timestamp />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </DataProvider>
  </StrictMode>,
)
