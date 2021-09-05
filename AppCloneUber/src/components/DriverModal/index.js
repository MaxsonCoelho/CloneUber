import React, { useState, useEffect } from 'react';
import { Modal } from 'react-native';
import { AirbnbRating } from 'react-native-ratings';
import useDriverUberApi from '../../hooks/useDriverUberApi';
import * as S from './styled';


export default ({visible, driver, visibleAction}) => {
    const api = useDriverUberApi();

    const [showStars, setShowStars] = useState(false); 
    
    //renderiza o componente de avaliação
    const handleFinishTrip = () => {
        setShowStars(true);
    }

    //envia a informação da avaliação para api e fecha o modal de motorista
    const handleRating = async (rating) => {
        await api.setRating(rating);
        visibleAction(false);
        alert('Obrigado por viajar com nossa empresa!');
    }

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
                {!showStars &&
                    <>
                        <S.DriverCarInfo>
                            <S.DriverCar>{driver.carName}</S.DriverCar>
                            <S.DriverColor>{driver.carColor}</S.DriverColor>
                            <S.DriverPlate>{driver.carPlate}</S.DriverPlate>
                        </S.DriverCarInfo>
                        <S.TripButton onPress={handleFinishTrip}>
                            <S.TripButtonText>Encerrar Viagem</S.TripButtonText>
                        </S.TripButton>
                    </>
                }
                {showStars &&
                    <>
                        <S.RatingTitle>Avalie o motorista para encerrar a viagem</S.RatingTitle>
                        <AirbnbRating 
                            count={5}
                            reviews={['Terrível', 'Ruim', 'Bom', 'Muito bom', 'Ótimo']}
                            defaultRating={5}
                            onFinishRating={handleRating}
                        />
                    </>
                }
            </S.ModalArea>
        </Modal>
    )
}