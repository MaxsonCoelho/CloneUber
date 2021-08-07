import styled from "styled-components/native";


export const Container = styled.View`
flex: 1;
`;

export const Header = styled.View`
height: 150px;
background-color: #3574cb;
justify-content: center;
padding-left: 20px;
`;

export const HeaderTitle = styled.Text`
color: #fff;
font-size: 27px;
`;

export const Menu = styled.View`
background-color: #3574cb;
flex-direction: row;
padding-left: 20px;
`;

export const MenuItem = styled.TouchableHighlight`
padding: 20px;
border-bottom-width: 5px;
border-bottom-color: ${props=>props.active?'#fff':'#3574cb'};
`;

export const MenuItemText = styled.Text`
color: #fff;
font-size: 16px;
`;

