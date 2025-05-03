import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, Modal, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { apiConfig } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { jwtDecode } from 'jwt-decode';
import { Calendar } from 'react-native-calendars';

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
    const [showForm, setShowForm] = useState(false);
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [dataAlerta, setDataAlerta] = useState('');
    const [editingAlertId, setEditingAlertId] = useState<number | null>(null);
    const [calendarVisible, setCalendarVisible] = useState(false);
    const navigation = useNavigation<AlertScreenNavigationProp>();

    useEffect(() => {
        fetchAlerts();
    }, []);

    const fetchAlerts = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (token) {
                const response = await fetch(`${apiConfig.baseUrl}${apiConfig.endpoints.listarAlertas}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                setAlerts(data.alertas || []);
            }
        } catch (error) {
            console.error('Error fetching alerts:', error);
            Alert.alert('Erro', 'Não foi possível carregar os alertas');
        }
    };

    const handleCreate = async () => {
        if (!titulo.trim() || !descricao.trim() || !dataAlerta.trim()) {
            return Alert.alert('Erro', 'Por favor, preencha todos os campos');
        }

        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) return Alert.alert('Erro', 'Usuário não autenticado');
            
            const decodedToken: any = jwtDecode(token);
            const userId = decodedToken.id;

            const body = {
                usuario_id: userId,
                titulo,
                descricao,
                data_alerta: dataAlerta,
            };

            const response = await fetch(`${apiConfig.baseUrl}${apiConfig.endpoints.criarAlerta}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                Alert.alert('Sucesso', 'Alerta criado com sucesso');
                resetForm();
                fetchAlerts();
            } else {
                const data = await response.json();
                Alert.alert('Erro', data.message || 'Erro ao criar alerta');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Erro ao criar alerta');
        }
    };

    const handleUpdate = async () => {
        if (!titulo.trim() || !descricao.trim() || !dataAlerta.trim()) {
            return Alert.alert('Erro', 'Por favor, preencha todos os campos');
        }

        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) return Alert.alert('Erro', 'Usuário não autenticado');
            
            const decodedToken: any = jwtDecode(token);
            const userId = decodedToken.id;

            const body = {
                alert_id: editingAlertId,
                usuario_id: userId,
                titulo,
                descricao,
                data_alerta: dataAlerta,
            };

            const response = await fetch(`${apiConfig.baseUrl}${apiConfig.endpoints.atualizarAlerta}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                Alert.alert('Sucesso', 'Alerta atualizado com sucesso');
                resetForm();
                fetchAlerts();
            } else {
                const data = await response.json();
                Alert.alert('Erro', data.message || 'Erro ao atualizar alerta');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Erro ao atualizar alerta');
        }
    };

    const handleSave = () => {
        if (editingAlertId !== null) {
            handleUpdate();
        } else {
            handleCreate();
        }
    };

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

    const resetForm = () => {
        setTitulo('');
        setDescricao('');
        setDataAlerta('');
        setEditingAlertId(null);
        setShowForm(false);
    };

    const handleEdit = (alert: Alerta) => {
        setTitulo(alert.titulo);
        setDescricao(alert.descricao);
        setDataAlerta(alert.data_alerta);
        setEditingAlertId(alert.id);
        setShowForm(true);
    };

    const formatDateDisplay = (dateString: string) => {
        const [year, month, day] = dateString.split('-').map(Number);
        const date = new Date(year, month - 1, day); // Construir no horário local
        return date.toLocaleDateString('pt-BR');
    };

    const openCalendar = () => {
        setCalendarVisible(true);
    };

    const onDateSelected = (day: { dateString: string }) => {
        setDataAlerta(day.dateString);
        setCalendarVisible(false);
    };

    return (
        <View style={styles.container}>
            {showForm && (
                <View style={styles.form}>
                    <TextInput
                        style={styles.input}
                        placeholder="Título do Alerta"
                        value={titulo}
                        onChangeText={setTitulo}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Descrição"
                        value={descricao}
                        onChangeText={setDescricao}
                        multiline
                    />
                    <TouchableOpacity onPress={openCalendar} style={styles.input}>
                        <Text>{dataAlerta ? formatDateDisplay(dataAlerta) : 'Selecionar Data do Alerta'}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.buttonText}>{editingAlertId !== null ? 'Atualizar Alerta' : 'Salvar Alerta'}</Text>
                    </TouchableOpacity>
                </View>
            )}

            <FlatList
                data={alerts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardTitle}>{item.titulo}</Text>
                            <View style={styles.iconContainer}>
                                <TouchableOpacity onPress={() => handleEdit(item)}>
                                    <Icon name="edit" size={20} color="#1461de" style={styles.icon} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                                    <Icon name="trash" size={20} color="#FF6347" style={styles.icon} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <Text style={styles.cardDescription}>{item.descricao}</Text>
                        <Text style={styles.cardDate}>Data: {formatDateDisplay(item.data_alerta)}</Text>
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>Nenhum alerta encontrado.</Text>}
            />

            <TouchableOpacity style={styles.createButton} onPress={() => setShowForm(!showForm)}>
                <Text style={styles.buttonText}>{showForm ? 'Cancelar' : 'Criar Novo Alerta'}</Text>
            </TouchableOpacity>

            <Modal visible={calendarVisible} transparent animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.calendarBox}>
                        <Calendar onDayPress={onDateSelected} />
                        <TouchableOpacity onPress={() => setCalendarVisible(false)} style={styles.cancelButton}>
                            <Text style={styles.buttonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    form: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 8,
        marginBottom: 20,
        elevation: 3,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        backgroundColor: 'white',
    },
    card: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    cardDescription: {
        marginBottom: 5,
    },
    cardDate: {
        color: '#666',
    },
    iconContainer: {
        flexDirection: 'row',
        gap: 10,
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
    saveButton: {
        backgroundColor: '#28A745',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    cancelButton: {
        backgroundColor: '#888',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
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
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    calendarBox: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '90%',
    },
});
