import React from 'react';
import { TextInput } from 'react-native-paper';
import { Colors } from '../../utils/Colors';
import { IInputRenderer } from '../../interfaces/IInputRenderer';
import { inputRendererStyles } from './InputRendererStyles';

const InputRenderer = ({ label, value, onChangeText, keyboardType = 'default' }: IInputRenderer) => {
  return (
    <TextInput
      mode="outlined"
      label={label}
      outlineColor={Colors.alto}
      activeOutlineColor={Colors.alizarinCrimson}
      textColor={Colors.black}
      multiline={false} // Set to false unless needed
      outlineStyle={inputRendererStyles.inputElement}
      contentStyle={inputRendererStyles.contentStyles}
      keyboardType={keyboardType}
      value={value}
      onChangeText={onChangeText} // ✅ Added this to update state
    />
  );
};

export default InputRenderer;
