import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { apiConfig } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { jwtDecode } from 'jwt-decode';
import * as Notifications from 'expo-notifications';

type AlertScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Alert'>;

interface Alerta {
    id: number;
    usuario_id: number;
    titulo: string;
    descricao: string;
    data_alerta: string;
}

export default function AlertScreen() {
    const [alerts, setAlerts] = useState<Alerta[]>([]);
    const [todayAlerts, setTodayAlerts] = useState<Alerta[]>([]);
    const [upcomingAlerts, setUpcomingAlerts] = useState<Alerta[]>([]);
    const [notifiedAlerts, setNotifiedAlerts] = useState<Set<number>>(new Set());
    const navigation = useNavigation<AlertScreenNavigationProp>();

    const handleNotification = async (titulo: string, descricao: string): Promise<void> => {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
    
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
    
        if (finalStatus !== 'granted') {
            return;
        }
    
        await Notifications.scheduleNotificationAsync({
            content: {
                title: titulo,
                body: descricao,
            },
            trigger: null, // Envia imediatamente
        });
    };

    const fetchAlerts = useCallback(async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (token) {
                const decodedToken: any = jwtDecode(token);
                const userId = decodedToken.id;

                // Buscar todos os alertas
                const response = await fetch(`${apiConfig.baseUrl}${apiConfig.endpoints.listarAlertas}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                
                // Verifica se os alertas têm a estrutura correta
                const alertasValidos = (data.alertas || []).filter((alert: any) => {
                    const isValid = alert && 
                        typeof alert.id === 'number' &&
                        typeof alert.titulo === 'string' &&
                        typeof alert.descricao === 'string' &&
                        typeof alert.data_alerta === 'string';
                    
                    return isValid;
                });
                
                setAlerts(alertasValidos);

                // Buscar alertas de hoje
                const todayResponse = await fetch(`${apiConfig.baseUrl}${apiConfig.endpoints.verificarAlerta(userId)}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });
                const todayData = await todayResponse.json();
                
                // Verifica se os alertas de hoje têm a estrutura correta
                const todayAlertsValidos = (todayData.alertas_disparados || []).filter((alert: any) => {
                    const isValid = alert && 
                        typeof alert.id === 'number' &&
                        typeof alert.titulo === 'string' &&
                        typeof alert.descricao === 'string' &&
                        typeof alert.data_alerta === 'string';
                    
                    return isValid;
                });
                
                setTodayAlerts(todayAlertsValidos);

                todayAlertsValidos.forEach(async (alert) => {
                    if (!notifiedAlerts.has(alert.id)) {
                        await handleNotification(
                            `Alerta: ${alert.titulo}`,
                            `Você tem um alerta para hoje: ${alert.descricao}`
                        );
                        setNotifiedAlerts(prev => new Set([...prev, alert.id]));
                    }
                });

                // Separar alertas futuros
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                const upcoming = alertasValidos.filter((alert: Alerta) => {
                    try {
                        const [year, month, day] = alert.data_alerta.split('-').map(Number);
                        const alertDate = new Date(year, month - 1, day);
                        alertDate.setHours(0, 0, 0, 0);
                        return alertDate >= today;
                    } catch (error) {
                        console.error('Erro ao processar data do alerta:', error);
                        return false;
                    }
                });
                
                setUpcomingAlerts(upcoming);
            }
        } catch (error) {
            console.error('Error fetching alerts:', error);
            Alert.alert('Erro', 'Não foi possível carregar os alertas');
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchAlerts();
        }, [fetchAlerts])
    );

    const handleDelete = async (alertId: number) => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) return Alert.alert('Erro', 'Usuário não autenticado');

            const response = await fetch(`${apiConfig.baseUrl}${apiConfig.endpoints.deletarAlerta(alertId)}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                Alert.alert('Sucesso', 'Alerta deletado');
                fetchAlerts();
            } else {
                const data = await response.json();
                Alert.alert('Erro', data.message || 'Erro ao deletar alerta');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Erro ao deletar alerta');
        }
    };

    const handleEdit = (alert: Alerta) => {
        navigation.navigate('CreateAlert', { alertToEdit: alert });
    };

    const formatDateDisplay = (dateString: string) => {
        try {
            const [year, month, day] = dateString.split('-').map(Number);
            const date = new Date(year, month - 1, day);
            return date.toLocaleDateString('pt-BR');
        } catch (error) {
            console.error('Erro ao formatar data:', error);
            return dateString;
        }
    };

    const renderAlertItem = ({ item, isToday }: { item: Alerta, isToday: boolean }) => {
        return (
            <View style={[styles.card, isToday && styles.todayCard]}>
                <View style={styles.cardHeader}>
                    <View style={styles.titleContainer}>
                        <Text style={[styles.cardTitle, isToday && styles.todayText]}>{item.titulo}</Text>
                    </View>
                    <View style={styles.iconContainer}>
                        {isToday && <Text style={styles.todayBadge}>HOJE</Text>}
                        <TouchableOpacity onPress={() => handleEdit(item)}>
                            <Icon name="edit" size={20} color="#1461de" style={styles.icon} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDelete(item.id)}>
                            <Icon name="trash" size={20} color="#FF6347" style={styles.icon} />
                        </TouchableOpacity>
                    </View>
                </View>
                <Text style={[styles.cardDescription, isToday && styles.todayText]}>{item.descricao}</Text>
                <Text style={[styles.cardDate, isToday && styles.todayText]}>Data: {formatDateDisplay(item.data_alerta)}</Text>
            </View>
        );
    };

    useEffect(() => {
        // Configuração das notificações
    Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: true,
                shouldSetBadge: true,
                shouldShowBanner: true,
                shouldShowList: true,
            }),
        });
    }, []);

    return (
        <View style={styles.container}>
            <FlatList
                data={[
                    { title: 'Alertas de Hoje', data: todayAlerts, isToday: true },
                    { title: 'Próximos Alertas', data: upcomingAlerts, isToday: false },
                ]}
                renderItem={({ item }) => {
                    return (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>{item.title}</Text>
                            {item.data.length > 0 ? (
                                <FlatList
                                    data={item.data}
                                    renderItem={({ item: alert }) => renderAlertItem({ item: alert, isToday: item.isToday })}
                                    keyExtractor={(alert) => alert.id.toString()}
                                    scrollEnabled={false}
                                />
                            ) : (
                                <Text style={styles.emptyText}>Nenhum alerta encontrado.</Text>
                            )}
                        </View>
                    );
                }}
                keyExtractor={(item) => item.title}
            />

            <TouchableOpacity 
                style={styles.createButton} 
                onPress={() => navigation.navigate('CreateAlert', {})}
            >
                <Text style={styles.buttonText}>Criar Novo Alerta</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    card: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        elevation: 3,
        position: 'relative',
    },
    todayCard: {
        backgroundColor: '#FFF3E0',
        borderLeftWidth: 4,
        borderLeftColor: '#FF9800',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 5,
    },
    titleContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
    },
    todayText: {
        color: '#E65100',
    },
    cardDescription: {
        marginBottom: 5,
    },
    cardDate: {
        color: '#666',
    },
    todayBadge: {
        backgroundColor: '#FF9800',
        color: 'white',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        fontSize: 12,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    iconContainer: {
        flexDirection: 'row',
        gap: 10,
        marginLeft: 10,
    },
    icon: {
        marginLeft: 10,
    },
    createButton: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#777',
    },
});
