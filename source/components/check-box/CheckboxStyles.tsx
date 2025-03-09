import { StyleSheet } from 'react-native';
import { Colors } from '../../utils/Colors';

export const checkboxStyles = StyleSheet.create({
    checkCont:{
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
    },
    checkLabel:{
        fontSize:15,
        fontWeight:'600',
        color:Colors.gray,
    },
});
