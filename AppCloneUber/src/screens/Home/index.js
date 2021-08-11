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
    const [mapLoc, setMapLoc] = useState(null);
    

    const handleFromClick = () => {

    }

    const handleToClick = async() => {
        const geo = await Geocoder.from('Goodwill Store');
        if(geo.results.length > 0) {
            const loc = {
                name:geo.results[0].formatted_address,
                center:{
                    latitude:geo.results[0].geometry.location.lat,
                    longitude:geo.results[0].geometry.location.lng,
                },
                zoom:16,
                pitch:0,
                altitude:0,
                heading:0
            };
            
            setToLoc(loc);
        }
    }

    useEffect(()=> {
        //inicia o geocoder
        Geocoder.init(MapsAPI, {language:'pt-br'});

        const getMyCurrentPosition = () => {
            Geolocation.getCurrentPosition(
                async position => {
                  
                  let latitude = await position.coords.latitude;
                  let longitude = await position.coords.longitude;

                  setMapLoc({
                      latitude: latitude,
                      longitude: longitude,
                      latitudeDelta:0.0922,
                      longitudeDelta:0.0421
                  });
                },
                error => Alert.alert('Error', JSON.stringify(error)),
                {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
              );
            
        }
        getMyCurrentPosition();
    }, [])

    return (
        <S.Container>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <MapView
                ref={map}
                style={{flex:1}}
                provider="google"
                minZoomLevel={16}
                region={mapLoc}
            >

                {fromLoc.center &&
                    <MapView.Marker pinColor="black" coordinate={fromLoc.center} />
                }

                {toLoc.center &&
                    <MapView.Marker pinColor="black" coordinate={toLoc.center} />
                }

            </MapView>
            <S.IntineraryArea>
                <S.IntineraryItem onPress={handleFromClick} underlayColor="#EEE">
                    <>
                        <S.IntineraryLabel>
                            <S.IntineraryPoint color="#0000ff"/>
                            <S.IntineraryTitle>Origem</S.IntineraryTitle>
                        </S.IntineraryLabel>

                        {fromLoc.name &&
                            <S.IntineraryValue>{fromLoc.name}</S.IntineraryValue>
                        }
                        {!fromLoc.name &&
                            <S.IntineraryPlaceHolder>Escolha um local de origem</S.IntineraryPlaceHolder>
                        }
                        
                    </>
                </S.IntineraryItem>
                <S.IntineraryItem onPress={handleToClick} underlayColor="#EEE">
                    <>
                        <S.IntineraryLabel>
                            <S.IntineraryPoint color="#00ff00"/>
                            <S.IntineraryTitle>Destino</S.IntineraryTitle>
                        </S.IntineraryLabel>

                        {toLoc.name &&
                            <S.IntineraryValue>{toLoc.name}</S.IntineraryValue>
                        }
                        {!toLoc.name &&
                            <S.IntineraryPlaceHolder>Escolha um local de origem</S.IntineraryPlaceHolder>
                        }

                    </>
                </S.IntineraryItem>
            </S.IntineraryArea>
        </S.Container>
    )
}

export default Home;