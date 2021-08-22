import styled from 'styled-components/native';

export const ModalArea = styled.View`
flex:1;
background-color:#fff;
`;

export const ModalHeader = styled.View`
flex-direction: row;
align-items: center;
padding: 20px;
`;

export const ModalClose = styled.TouchableHighlight`
width: 40px;
height: 40px;
justify-content: center;
align-items: center;
background-color: #eee;
border-radius: 20px;
`;

export const ModalCloseText = styled.Text`

`;

export const ModalTitle = styled.Text`
margin-left: 20px;
font-size: 18px;
color: #999;
font-weight: bold;
`;