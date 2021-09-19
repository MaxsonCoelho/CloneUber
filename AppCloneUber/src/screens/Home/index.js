import React, { useRef, useState, useEffect } from 'react';
import { ActivityIndicator, StatusBar  } from 'react-native';
import MapView from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import MapViewDirections from 'react-native-maps-directions';
import { MapsAPI } from '../../config';
import useDriverUberApi from '../../hooks/useDriverUberApi';
import AddressModal from '../../components/AddressModal';
import DriverModal from '../../components/DriverModal';
import * as S from './styled';


const Home = (props) => {
    const map = useRef();
    const api = useDriverUberApi();

    const [fromLoc, setFromLoc] = useState({});
    const [toLoc, setToLoc] = useState({});
    const [mapLoc, setMapLoc] = useState(null);
    const [minZoom, setMinZoom] = useState(16);
    const [showDirections, setShowDirections] = useState(false);
    const [requestDistance, setRequestDistance] = useState(0);
    const [requestTime, setRequestTime] = useState(0);
    const [requestPrice, setRequestPrice] = useState(0);

    const [modalTitle, setModalTitle] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [modalField, setModalField] = useState('');
    const [driverInfo, setDriverInfo] = useState({});
    const [driverModalVisible, setDriverModalVisible] = useState(false);

    const [loading, setLoading] = useState(false);

    
    //abre o modal de endereço da origem
    const handleFromClick = () => {
        setModalTitle('Escolha uma origem');
        setModalField('from');
        setModalVisible(true);
    }

    //pega o ponto de destino
    const handleToClick = async() => {
        setModalTitle('Escolha uma destino');
        setModalField('to');
        setModalVisible(true);
    }

    //lê a distancia e calcula o preço baseado em km
    const handleDirectionsReady = async (r) => {
        setRequestDistance(r.distance);
        setRequestTime(r.duration);

        const priceReq = await api.getRequestPrice(r.distance);
        if(!priceReq.error) {
            setRequestPrice(priceReq.price);
        }

        setMinZoom(0);
        map.current.fitToCoordinates(r.coordinates, {
            edgePadding:{
                left:50,
                right:50,
                bottom:50,
                top:1300
            }
        });
    }

    //encontra o motorista e recebe via api seus dados
    const handleRequestGo = async () => {
        setLoading(true);

        const driver = await api.findDriver({
            fromlat:fromLoc.center.latitude,
            fromlng:fromLoc.center.longitude,
            tolat:toLoc.center.latitude,
            tolng:toLoc.center.longitude
        });
        setLoading(false);

        if(!driver.error){
            setDriverInfo(driver.driver);
            setDriverModalVisible(true);
            handleRequestCancel();
        } else {
            alert(driver.error);
        }
    }

    //seta o mapa para posição inicial cancelando todos os estados
    const handleRequestCancel = () => {
        setToLoc({});
        setShowDirections(false);
        setRequestDistance(0);
        setRequestTime(0);
        setRequestPrice(0);

        setMapLoc(fromLoc);
    }

    //seta a posição com o que vem do método camera 
    const handleMapChange = async () => {
        const cam = await map.current.getCamera();
        cam.altitude = 0
        setMapLoc(cam)
    }

    //recebe dados do modal via função prop
    const handleModalClick = (field, address) => {
        const loc = {
                    name:address.address,
                    center:{
                        latitude:address.latitude,
                        longitude:address.longitude,
                    },
                    zoom:16,
                    pitch:0,
                    altitude:0,
                    heading:0
                };

                switch(field) {
                    case 'to':
                        setToLoc(loc);
                        break;
                    case 'from':
                        setFromLoc(loc);
                        break;
                }
    }

    const handleMenu = () => {
        props.navigation.openDrawer();
    }

    //pega localização atual e coloca no ponto de partida
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
        setMinZoom(16)
        
    }, [])

    //ativa o componente MapViewDirections se existir ponto de partida e de destino
    useEffect(()=> {
        if(fromLoc.center && toLoc.center) {
            setShowDirections(true);
        }

    }, [toLoc]);

    //monitora o local de origem colocando pin onde é setado
    useEffect(()=> {
        if(fromLoc.center) {
            setMapLoc(fromLoc);
        }
    }, [fromLoc])

    return (
        <S.Container>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <DriverModal 
                driver={driverInfo}
                visible={driverModalVisible}
                visibleAction={setDriverModalVisible}
            />
            <AddressModal 
                modalTitle={modalTitle}
                visible={modalVisible}
                visibleAction={setModalVisible}
                field={modalField}
                clickAction={handleModalClick}
            />
            <MapView
                ref={map}
                style={{flex:1}}
                provider="google"
                minZoomLevel={minZoom}
                camera={mapLoc}
                onRegionChangeComplete={handleMapChange}
            >

                {fromLoc.center &&
                    <MapView.Marker pinColor="red" coordinate={fromLoc.center} />
                }

                {toLoc.center &&
                    <MapView.Marker pinColor="red" coordinate={toLoc.center} />
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
            <S.MenuArea onPress={handleMenu} underlayColor="transparent" >
                <S.MenuImage source={require('../../assets/menu.png')} />
            </S.MenuArea>
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
                {fromLoc.center && toLoc.center &&
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
                            <S.RequestButtons>
                                <S.RequestButton color="#00FF00" onPress={handleRequestGo}>
                                    <S.RequestButtonText>Solicitar Motorista</S.RequestButtonText>
                                </S.RequestButton>
                                <S.RequestButton color="#FF0000" onPress={handleRequestCancel}>
                                    <S.RequestButtonText>cancelar</S.RequestButtonText>
                                </S.RequestButton>
                            </S.RequestButtons>
                        </>
                    </S.IntineraryItem>
                }
            </S.IntineraryArea>
            {loading &&
                <S.LoadingArea>
                    <ActivityIndicator size="large" color="#FFF" />
                </S.LoadingArea>
            }
        </S.Container>
    )
}

export default Home;