import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigation from './source/navigations/StackNavigation';
import { navigationRef } from './source/utils/NavigationType';

const App = () => {
  return(
    <NavigationContainer ref={navigationRef}>
      <StackNavigation/>
    </NavigationContainer>
  );
};

export default App;
