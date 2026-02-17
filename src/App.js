import React from 'react';
import { StoryProvider } from './context/StoryContext';
import AppRouter from './components/AppRouter';

function App() {
  return (
    <StoryProvider>
      <AppRouter />
    </StoryProvider>
  );
}

export default App;