import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Route, Routes } from 'react-router-dom';
import ProductsGrid from './ProductsGrid.jsx';
import ProductSelect from './ProductsSelect.jsx';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<ProductsGrid />} />
        <Route
          exact
          path="/combo"
          element={<ProductSelect />}
        />
      </Routes>
    </HashRouter>
  </React.StrictMode>
);