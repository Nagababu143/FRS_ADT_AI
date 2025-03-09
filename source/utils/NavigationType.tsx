import { NavigationContainerRef} from '@react-navigation/native';
import React from 'react';
import { RootStackParamList } from '../navigations/StackNavigation';

export const navigationRef = React.createRef<NavigationContainerRef<RootStackParamList>>();
export function navigate(name: keyof RootStackParamList) {
    navigationRef.current?.navigate(name);
}