
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { connect } from 'react-redux';
import Login from '../Login';
import HomeDrawer from '../../navigators/HomeDrawer';

const Preload = (props) => {

    const [permission, setPermission] = useState(false);

    useEffect(() => {
        if(!props.token) {
            setPermission(false);
        } else {
            setPermission(true);
        }
    }, [])

    return (
        <>
            <StatusBar backgroundColor="#0B004E" barStyle="light-content" />
            {permission ? // alterar dnv aqui, tirar exclamação
                <Login /> :
                <HomeDrawer />
            }
        </>
    )

}

const mapStateToProps = (state) => {
    return {
        token:state.userReducer.token
    };
}

export default connect(mapStateToProps)(Preload);