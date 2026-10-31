import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { AppProvider } from '@/app/providers/AppContext';
import { router } from '@/app/router';

export const App: React.FC = () => {
  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  );
};

export default App;
