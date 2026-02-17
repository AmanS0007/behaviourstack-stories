import React from 'react';
import { useStory } from '../context/StoryContext';
import LandingPage from './LandingPage';
import StoryLayout from './StoryLayout';

function AppRouter() {
  const { activeBrand } = useStory();

  if (!activeBrand) {
    return <LandingPage />;
  }

  return <StoryLayout />;
}

export default AppRouter;