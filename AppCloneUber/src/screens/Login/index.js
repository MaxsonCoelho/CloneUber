import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StatusBar, Platform, ScrollView, Text, ActivityIndicator } from 'react-native';
import useDevsUberApi from '../../hooks/useDevsUberApi';
import * as S from './styled';

const Login = (props) => {
    const navigation = useNavigation();
    const api = useDevsUberApi();

    const [activeMenu, setActiveMenu] = useState('Login');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);


    const handleSignIn = async () => {
        if(email && password) {
            setLoading(true);
            await api.signin(email, password)
            .then((res) => {
                if(res.error) {
                    alert(error);
                } else {
                    props.setToken(res.token);
                    navigation.navigate('Home')
                }
            })
            .catch(e => console.log(e));
            setLoading(false);
        }
    }

    const handleSignUp = async () => {
        setLoading(true);
        if(name && email && password) {
            await api.signup(name, email, password)
            .then((res) => {
                if(res.error) {
                    alert(error);
                } else {
                    props.setToken(res.token);
                    navigation.navigate('Home')
                }
            })
            .catch(e => console.log(e));
            setLoading(false);
        }
    }

    return (
        <S.Container behavior={Platform.OS == 'ios'?'padding':null}>
            <StatusBar barStyle="light-content" backgroundColor="#000" />
            <S.Header>
                <S.HeaderTitle>Uber</S.HeaderTitle>
            </S.Header>
            <S.Menu>
                <S.MenuItem active={activeMenu == 'Login'} onPress={() => setActiveMenu('Login')} underlayColor="transparent">
                    <S.MenuItemText>Login</S.MenuItemText>
                </S.MenuItem>
                <S.MenuItem active={activeMenu == 'Cadastrar'} onPress={() => setActiveMenu('Cadastrar')} underlayColor="transparent">
                    <S.MenuItemText>Cadastrar</S.MenuItemText>
                </S.MenuItem>
            </S.Menu>

           <ScrollView>
            {activeMenu == 'Cadastrar' &&
                <S.Input editable={!loading} value={name} onChangeText={t=>setName(t)} placeholder="Nome" placeholderTextColor="#999"/>
            }
            <S.Input editable={!loading} value={email} onChangeText={t=>setEmail(t)} keyboardType="email-address" autoCapitalize='none' placeholder="E-mail" placeholderTextColor="#999"/>
            <S.Input editable={!loading} value={password} onChangeText={t=>setPassword(t)} placeholder="Senha" placeholderTextColor="#999" secureTextEntry/>

            {activeMenu == 'Login' && 
                <S.ActionButton disable={loading} onPress={handleSignIn}>
                    <S.ActionButtonText>Login</S.ActionButtonText>
                </S.ActionButton>
            }
            
            {activeMenu == 'Cadastrar' &&
                <S.ActionButton disable={loading} onPress={handleSignUp}>
                    <S.ActionButtonText>Cadastrar</S.ActionButtonText>
                </S.ActionButton>
            }
            <Text>token:{props.token}</Text>

           </ScrollView>
            {loading &&
                <S.LoadingArea>
                    <ActivityIndicator size="large" color="#fff" />
                </S.LoadingArea>
            }
        </S.Container>
    )
}


const mapStateToProps = (state) => {
    return {
        token:state.userReducer.token
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        setToken:(token)=>dispatch({type:'SET_TOKEN', payload:{token}})
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);

