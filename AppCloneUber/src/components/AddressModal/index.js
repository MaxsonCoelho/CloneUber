import React from 'react';
import { Modal } from 'react-native';
import * as S from './styled';

export default ({ visible, modalTitle, visibleAction }) => {

    const handleCloseAction = () => {
        visibleAction(false);
    }

    return (
        <Modal
            animationType='slide'
            transparent={false}
            visible={visible}
        >
            <S.ModalArea>
                <S.ModalHeader>
                    <S.ModalClose onPress={handleCloseAction}>
                        <S.ModalCloseText>X</S.ModalCloseText>
                    </S.ModalClose>
                    <S.ModalTitle>{modalTitle}</S.ModalTitle>
                </S.ModalHeader>
            </S.ModalArea>
            
        </Modal>
    )
}