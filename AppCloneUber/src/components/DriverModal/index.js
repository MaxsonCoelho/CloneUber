import React, { useState, useEffect } from 'react';
import Geocoder from 'react-native-geocoding';
import { MapsAPI } from '../../config';
import { Modal } from 'react-native';
import * as S from './styled';


export default ({visible, driver}) => {



    return (
        <Modal
            animationType='slide'
            transparent={false}
            visible={visible}
        >
            <S.ModalArea>
                <S.DriverHeadline>Seu motorista é:</S.DriverHeadline>
                <S.DriverAvatar source={{uri:driver.avatar}} />
                <S.DriverName>{driver.name}</S.DriverName>
                <S.DriverStars>{driver.stars}</S.DriverStars>
                <S.DriverCarInfo>
                <S.DriverCar>{driver.carName}</S.DriverCar>
                <S.DriverColor>{driver.carColor}</S.DriverColor>
                <S.DriverPlate>{driver.carPlate}</S.DriverPlate>
                </S.DriverCarInfo>
                <S.TripButton>
                    <S.TripButtonText>Encerrar Viagem</S.TripButtonText>
                </S.TripButton>
            </S.ModalArea>
        </Modal>
    )
}