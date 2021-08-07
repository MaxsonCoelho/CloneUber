import React, { useState } from 'react'
import * as S from './styled';

const Login = () => {

    const [activeMenu, setActiveMenu] = useState('Login');

    return (
        <S.Container>
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
        </S.Container>
    )
}


export default Login;

