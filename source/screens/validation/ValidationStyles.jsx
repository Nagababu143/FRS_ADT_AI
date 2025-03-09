import { StyleSheet } from 'react-native';
import { Colors } from '../../utils/Colors';

export const validationStyles = StyleSheet.create({
    container:{
        flex:1,
    },
    imgCont:{
        flex:1,
        paddingHorizontal:24,
        display:'flex',
        flexDirection:'column',
        justifyContent:'space-evenly',
    },
    ttdLogo:{
        alignSelf:'center',
        height:120,
        width:120,
        borderRadius:60,
        borderWidth:2,
        borderColor:Colors.razzleDazzleRose,
    },
    progressText:{
        fontSize:24,
        color:Colors.alizarinCrimson,
        fontWeight:'500',
        textAlign:'center',
    },
});
