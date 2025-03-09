import { StyleSheet } from 'react-native';
import { Colors } from '../../utils/Colors';


const baseBtnCont = {
    borderWidth:2,
    borderRadius:10,
    paddingVertical:12,
};

const baseBtnText = {
    fontSize:18,
    fontWeight:'400',
    textAlign:'center',
};

export const appButtonStyles = StyleSheet.create({
    defaultButton:{
        ...baseBtnCont,
        borderColor:Colors.royalBlue,
        backgroundColor:Colors.fog,
    },
    defaultButtonText:{
        ...baseBtnText,
        color:Colors.royalBlue,
    },
    lgButton:{
        ...baseBtnCont,
        borderColor:Colors.portage,
    },
    lgButtonText:{
        ...baseBtnText,
        color:Colors.white,
    },
});
