import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StatusBar  } from 'react-native';
import MapView from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import { MapsAPI } from '../../config';
import * as S from './styled';

const Home = () => {
    const map = useRef();

    const [fromLoc, setFromLoc] = useState({});
    const [toLoc, setToLoc] = useState({});
    const [mapLoc, setMapLoc] = useState({
        center:{
            latitude:37.78825,
            longitude:-122.4324
        },
        zoom:16,
        pitch:0,
        altitude:0,
        heading:0
    });

    useEffect(()=> {
        //inicia o geocoder
        Geocoder.init(MapsAPI, {language:'pt-br'});
        getMyCurrentPosition();
    }, [])

    const getMyCurrentPosition = () => {
        Geolocation.getCurrentPosition(async (info)=> {
            const geo = await Geocoder.from(info.coords.latitude, info.coords.longitude);
            if(geo.results.length > 0) {
                const loc = {
                    name:geo.results[0].formatted_address,
                    center:{
                        latitude:info.coords.latitude,
                        longitude:info.coords.longitude
                    },
                    zoom:16,
                    pitch:0,
                    altitude:0,
                    heading:0
                }

                setMapLoc(loc);//localização atual
                setFromLoc(loc);//localização inicial de corrida
            }
        }, (e)=> {

        });
    }

    return (
        <S.Container>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <MapView
                ref={map}
                style={{flex:1}}
                provider="google"
                camera={mapLoc}
            ></MapView>
            <S.IntineraryArea>
                <S.IntineraryItem>
                    <>
                        <S.IntineraryLabel>
                            <S.IntineraryPoint />
                            <S.IntineraryTitle>Origem</S.IntineraryTitle>
                        </S.IntineraryLabel>
                        <S.IntineraryValue>...</S.IntineraryValue>
                    </>
                </S.IntineraryItem>
                <S.IntineraryItem>
                    <>
                        <S.IntineraryLabel>
                            <S.IntineraryPoint />
                            <S.IntineraryTitle>Destino</S.IntineraryTitle>
                        </S.IntineraryLabel>
                        <S.IntineraryValue>...</S.IntineraryValue>
                    </>
                </S.IntineraryItem>
            </S.IntineraryArea>
        </S.Container>
    )
}

export default Home;