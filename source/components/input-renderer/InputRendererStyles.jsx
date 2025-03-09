import { StyleSheet } from 'react-native';
import { Colors } from '../../utils/Colors';

export const inputRendererStyles = StyleSheet.create({
  inputElement: {
    height: 55,
    width: '100%',
    borderWidth: 1,
    borderRadius: 10,
  },
  contentStyles:{
    color:Colors.black,
    fontWeight:'400',
    fontSize:17,
  },
});
