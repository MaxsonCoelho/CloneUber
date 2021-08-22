import React, { useState, useEffect } from 'react';
import Geocoder from 'react-native-geocoding';
import { MapsAPI } from '../../config';
import { Modal } from 'react-native';
import * as S from './styled';

let timer;
export default ({ visible, modalTitle, visibleAction }) => {

    const [results, setResults] = useState([]);
    const [searchText, setSearchText] =useState('');

    //fecha o modal de endereço de origem
    const handleCloseAction = () => {
        visibleAction(false);
    }

    //assim que o modal se abrir ele limpa os dados do input
    const handleClose = () => {
        setResults([]);
        setSearchText('');
    }

    //inicia o geocoder pela chave de api do google
    useEffect(()=> {
        Geocoder.init(MapsAPI, {language:'pt-br'});
    }, []);

    //Faz a pesquisa respeitando um determinado tempo
    useEffect(()=> {
        if(searchText) {
            if(timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(async() => {
                const geo = await Geocoder.from(searchText);

                if(geo.results.length > 0) {
                    let tmpResults = [];
                    for(let i in geo.results) {
                        tmpResults.push({
                            address:geo.results[i].formatted_address,
                            latitude:geo.results[i].geometry.location.lat,
                            longitude:geo.results[0].geometry.location.lng
                        });
                    }
                    setResults(tmpResults);
                } else {
                    setResults([]);
                }

            }, 700)
        }
    }, [searchText])
    return (
        <Modal
            animationType='slide'
            transparent={false}
            visible={visible}
            onShow={handleClose}
        >
            <S.ModalArea>
                <S.ModalHeader>
                    <S.ModalClose onPress={handleCloseAction}>
                        <S.ModalCloseText>X</S.ModalCloseText>
                    </S.ModalClose>
                    <S.ModalInput value={searchText} onChangeText={t=>setSearchText(t)} autoFocus={true} placeholder={modalTitle} placaholderTextColor='#999'/>
                </S.ModalHeader>
                <S.ModalResults>
                    {results.map((i,k)=> (
                        <S.ModalResult key={k}>
                            <S.ModalResultText>{i.address}</S.ModalResultText>
                        </S.ModalResult>
                    ))}
                </S.ModalResults>
            </S.ModalArea>
            
        </Modal>
    )
}