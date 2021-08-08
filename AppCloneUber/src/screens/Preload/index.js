import { StackActions, NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';

const Preload = (props) => {
    //Login
    if(!props.token) {
        props.navigation.dispatch(StackActions.reset({
            index:0,
            actions:[
                NavigationActions.navigate({routeName:'Login'})
            ]
        }));
    } else {
        //Home
        props.navigation.dispatch(StackActions.reset({
            index:0,
            actions:[
                NavigationActions.navigate({routeName:'Login'})
            ]
        }));
    }

    return null;
}

const mapStateToProps = (state) => {
    return {
        token:state.userReducer.token
    };
}

export default connect(mapStateToProps)(Preload);