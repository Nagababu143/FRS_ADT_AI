import { KeyboardTypeOptions } from 'react-native';

export interface IInputRenderer{
    label:string;
    keyboardType?:KeyboardTypeOptions | undefined;
}
