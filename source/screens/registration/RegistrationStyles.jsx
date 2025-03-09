import { StyleSheet } from 'react-native';
import { Colors } from '../../utils/Colors';

export const registrationStyles = StyleSheet.create({
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
        height:74,
        width:67,
        alignSelf:'center',
    },
    registerTextCont:{
        alignSelf:'center',
        gap:3,
    },
    registerText:{
        fontSize:24,
        color:Colors.black,
        fontWeight:'600',
        textAlign:'center',
    },
    registerDescription:{
        fontSize:16,
        color:Colors.black,
        fontWeight:'400',
        textAlign:'center',
    },
    inputsCont:{
        gap:15,
    },
    loaderOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center', // ✅ Centered vertically
        alignItems: 'center', // ✅ Centered horizontally
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // ✅ Slight dim effect
        zIndex: 100, // ✅ Ensures it stays on top
      },
      loaderBox: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)', // ✅ Dark overlay box
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        elevation: 10, // ✅ Shadow effect
      },
      loaderText: {
        color: 'white',
        marginTop: 10,
        fontSize: 16,
        fontWeight: 'bold',
      },
});
