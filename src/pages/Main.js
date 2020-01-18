import  React , { useEffect, useState } from 'react';
import { StyleSheet, Image, Text, View, TextInput, TouchableOpacity } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location';
import { MaterialIcons} from '@expo/vector-icons';
import api from '../services/api';

function Main({ navigation }) {
    [currentRegion, setCurrentRegion] = useState(null);
    [devs, setDevs] = useState([]);
    [techs, setTechs] = useState('');

    useEffect(() => {
        async function loadInitialPosition(){
            const { granted } = await requestPermissionsAsync();
            if(granted){
                const { coords } = await getCurrentPositionAsync({
                    enableHighAccuracy: true
                });
                const { latitude , longitude } = coords;
                setCurrentRegion(  {
                    latitude,
                    longitude,
                    latitudeDelta: 0.04,
                    longitudeDelta: 0.04
                })
            }
        }

        loadInitialPosition();
    },[]);

    function handleRegionChanged(region){
        console.log(region);
        setCurrentRegion(region);
    }

    async function loadDevs(){
        console.log("calling loadDevs");
        const { latitude, longitude } = currentRegion;
        const response = await api.get('/search',{
            params: {
                latitude,
                longitude,
                techs
            }
        });
        console.log(response.data);
        setDevs(response.data.devs);
    }

    function calloutPressed(){
        navigation.navigate("Profile", { github_username : 'mgiatti' });
    }

    if(!currentRegion){
        return null
    }

    return (
        <>
        <MapView onRegionChangeComplete={handleRegionChanged} initialRegion={currentRegion} style={styles.map} >
            {devs.map(dev =>(
            <Marker 
                key={dev._id} 
                coordinate={{
                    longitude: dev.location.coordinates[0], 
                    latitude: dev.location.coordinates[1]
                }}> 
                <Image style={styles.avatar} source={{uri: dev.avatar_url }} />

                <Callout onPress={()=>{
                    navigation.navigate("Profile", { github_username : dev.github_username });
                }} >
                    <View style={styles.callout}>
                        <Text  style={styles.devName}>{dev.name}</Text>
                        <Text style={styles.devBio}>{dev.bio}</Text>
                        <Text  style={styles.devTechs}>{dev.techs.join(', ')}</Text>
                    </View>
                </Callout>
            </Marker>
            ))}
           
        </MapView>
        <View style={styles.searchForm}>
            <TextInput 
            value={techs}
            onChangeText={setTechs}
            style={styles.searchInput}
            placeholder="Search developers by tech"
            placeholderTextColor="#999"
            autoCapitalize="words"
            autoCorrect={false}
            />
            <TouchableOpacity onPress={loadDevs} style={styles.loadButton}>
                <MaterialIcons name="map-search" size={20} color="#FFF"></MaterialIcons>
            </TouchableOpacity>
            
        </View>
       </>
        )
}

const styles =  StyleSheet.create({
    map: {
        flex:1
    },
    avatar: {
        width: 54,
        height:54,
        borderRadius: 4,
        borderWidth: 4,
        borderColor: '#FFF'
    },
    callout: {
        width: 260
    },
    devName: {
        fontWeight: 'bold',
        fontSize: 16
    },
    devTechs: {
        marginTop: 5,

    },
    devBio: {
        marginTop: 5,
        color: '#666'
    },
    searchForm: {
        position: "absolute",
        top: 20,
        left: 20,
        right: 20,
        zIndex: 5,
        flexDirection: 'row',
    },
    searchInput: {
        flex: 1,
        height: 50,
        backgroundColor: '#FFF',
        color: '#333',
        borderRadius: 25,
        paddingHorizontal: 20,
        fontSize: 16,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: {
            width: 4,
            height: 4
        },
        elevation: 2
    },
    loadButton: {
        width: 50,
        height: 50,
        backgroundColor: '#8E4Dff',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15
    }
});
export default Main;