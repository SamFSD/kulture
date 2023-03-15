import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    headerContainer: {
        marginHorizontal: 10,
        marginVertical: 10,
    },
    header: {
        fontSize: 20,
        fontFamily: 'Comfortaa'
    },
    inputs: {
        padding: wp(2),
        marginHorizontal: hp(1),
    },
    tagHeader: {
        paddingVertical: 10,
    },
    tags: {
        fontSize: 18,
        fontFamily: 'Comfortaa'
    },  
    containerInput: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    input: {
        width: wp(70),
        height: hp(6),
        borderWidth: 2,
        borderRadius: 10,
        padding: 10,
        borderColor: '#000',
    },
    addContainer: {
        marginHorizontal: 14,
        marginVertical: 10,
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
        height: 60,
        backgroundColor: '#000',
        borderRadius: 10,
    },
    actions: {
        fontFamily: 'Comfortaa',
        color: '#fff',
        fontSize: 18,
    },
    imagePlaceholder: {
        marginTop: 10,
        alignItems: 'center',
    },
    placeholder: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 400,
        width: '80%',
        backgroundColor: '#eee',
        borderWidth: 2,
        borderColor: '#000',
        resizeMode: 'contain',
        borderRadius: 10,
    }
});

export default styles;