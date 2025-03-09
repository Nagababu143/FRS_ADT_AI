import React from 'react';
import { Checkbox } from 'react-native-paper';
import { ICheckbox } from '../../interfaces/ICheckbox';
import { Text, View } from 'react-native';
import { checkboxStyles } from './CheckboxStyles';
import { Colors } from '../../utils/Colors';

const CheckBox = ({label , checked , setChecked}:ICheckbox) => {
  return (
    <View style={checkboxStyles.checkCont}>
      <Checkbox
        status={checked ? 'checked' : 'unchecked'}
        onPress={() => {
          setChecked((prev)=>!prev);
        }}
        uncheckedColor={Colors.fog}
        color={Colors.royalBlue}
      />
      {label && <Text style={checkboxStyles.checkLabel}>{label}</Text>}
    </View>
  );
};

export default CheckBox;
