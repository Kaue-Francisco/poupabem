import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { apiConfig } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { jwtDecode } from 'jwt-decode';

type AlertScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Alert'>;

export default function AlertScreen() {
    const [alerts, setAlerts] = useState([]);
    const navigation = useNavigation<AlertScreenNavigationProp>();

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (token) {
                    const decodedToken: any = jwtDecode(token);
                    const userId = decodedToken.id;
                    const response = await fetch(`${apiConfig.baseUrl}/alerts/${userId}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    const data = await response.json();
                    setAlerts(data.alerts);
                }
            } catch (error) {
                console.error('Error fetching alerts:', error);
            }
        };

        fetchAlerts();
    }, []);

  return (
    <View style={styles.container}>
      <Text>No alerts available</Text>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    alertItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        width: '100%',
    },
    alertText: {
        fontSize: 16,
    },
    });
