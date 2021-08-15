import React, { useRef, useState, useEffect } from 'react';
import { StatusBar  } from 'react-native';
import MapView from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import MapViewDirections from 'react-native-maps-directions';
import { MapsAPI } from '../../config';
import useDevsUberApi from '../../hooks/useDevsUberApi';
import * as S from './styled';

const Home = () => {
    const map = useRef();
    const api = useDevsUberApi();

    const [fromLoc, setFromLoc] = useState({});
    const [toLoc, setToLoc] = useState({});
    const [mapLoc, setMapLoc] = useState(null);
    const [showDirections, setShowDirections] = useState(false);
    const [requestDistance, setRequestDistance] = useState(0);
    const [requestTime, setRequestTime] = useState(0);
    const [requestPrice, setRequestPrice] = useState(0);
    

    const handleFromClick = () => {

    }

    const handleToClick = async() => {
        const geo = await Geocoder.from('Manaus, Rua Misericórdia N 673');
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

    const handleDirectionsReady = async (r) => {
        setRequestDistance(r.distance);
        setRequestTime(r.duration);

        const priceReq = await api.getRequestPrice(r.distance);
        if(!priceReq.error) {
            setRequestPrice(priceReq.price);
        }

        map.current.fitToCoordinates(r.coordinates, {
            edgePadding:{
                left:50,
                right:50,
                bottom:50,
                top:400
            }
        });
    }

    useEffect(()=> {
        //inicia o geocoder
        Geocoder.init(MapsAPI, {language:'pt-br'});

        const getMyCurrentPosition = () => {
            Geolocation.getCurrentPosition(
                async position => {
                  
                  const geo = await Geocoder.from(position.coords.latitude, position.coords.longitude);

                  if(geo.results.length > 0) {
                      const loc = {
                          name:geo.results[0].formatted_address,
                          center:{
                              latitude:position.coords.latitude,
                              longitude:position.coords.longitude
                          },
                          zoom:16,
                          pitch:0,
                          altitude:0,
                          heading:0
                      };
                      setMapLoc(loc);
                      setFromLoc(loc);
                  }
                  
                },
                error => Alert.alert('Error', JSON.stringify(error)),
                {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
              );
            
        }
        getMyCurrentPosition();
        
    }, [])

    useEffect(()=> {
        if(fromLoc.center && toLoc.center) {
            setShowDirections(true);
        }

    }, [toLoc]);

    return (
        <S.Container>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <MapView
                ref={map}
                style={{flex:1}}
                provider="google"
                minZoomLevel={16}
                camera={mapLoc}
            >

                {fromLoc.center &&
                    <MapView.Marker pinColor="black" coordinate={fromLoc.center} />
                }

                {toLoc.center &&
                    <MapView.Marker pinColor="black" coordinate={toLoc.center} />
                }

                {showDirections &&
                    <MapViewDirections 
                        origin={fromLoc.center}
                        destination={toLoc.center}
                        strokeWidth={5}
                        strokeColor="black"
                        apikey={MapsAPI}
                        onReady={handleDirectionsReady}
                    />
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
                <S.IntineraryItem>
                    <>
                        <S.RequestDetails>
                            <S.RequestDetail>
                                <S.RequestTitle>Distância</S.RequestTitle>
                                <S.RequestValue>{requestDistance > 0 ? `${requestDistance.toFixed(1)}km`:'--'}</S.RequestValue>
                            </S.RequestDetail>
                            <S.RequestDetail>
                                <S.RequestTitle>Tempo</S.RequestTitle>
                                <S.RequestValue>{requestTime > 0 ? `${requestTime.toFixed(0)}mins`:'--'}</S.RequestValue>
                            </S.RequestDetail>
                            <S.RequestDetail>
                                <S.RequestTitle>Preço</S.RequestTitle>
                                <S.RequestValue>{requestPrice > 0 ? `R$ ${requestPrice.toFixed(2)}`:'--'}</S.RequestValue>
                            </S.RequestDetail>
                        </S.RequestDetails>
                    </>
                </S.IntineraryItem>
            </S.IntineraryArea>
        </S.Container>
    )
}

export default Home;