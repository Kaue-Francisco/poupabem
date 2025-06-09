import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Modal, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Category } from '../types/income';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useState } from 'react';

// Configuração da localização
LocaleConfig.locales['pt'] = {
  monthNames: [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro'
  ],
  monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  dayNames: ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
  dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
};

LocaleConfig.defaultLocale = 'pt';

type IncomeFormProps = {
  description: string;
  amount: string;
  category: string;
  categories: Category[];
  date: string;
  loading: boolean;
  onDescriptionChange: (text: string) => void;
  onAmountChange: (text: string) => void;
  onCategoryChange: (value: string) => void;
  onDateChange: (date: string) => void;
  onSubmit: () => void;
};

export const IncomeForm: React.FC<IncomeFormProps> = ({
  description,
  amount,
  category,
  categories,
  date,
  loading,
  onDescriptionChange,
  onAmountChange,
  onCategoryChange,
  onDateChange,
  onSubmit,
}) => {

  const [calendarVisible, setCalendarVisible] = useState(false);

  const formatDateDisplay = (dateString: string) => {
    if (!dateString) return 'Selecionar Data';
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.title}>Adicionar Receita</Text>
      <TextInput
        style={styles.input}
        placeholder="Descrição"
        value={description}
        onChangeText={onDescriptionChange}
      />
      <TextInput
        style={styles.input}
        placeholder="Valor"
        value={amount}
        onChangeText={onAmountChange}
        keyboardType="numeric"
      />
      <TouchableOpacity 
        style={styles.input} 
        onPress={() => setCalendarVisible(true)}
      >
        <Text style={styles.dateText}>{formatDateDisplay(date)}</Text>
      </TouchableOpacity>
      {loading ? (
        <ActivityIndicator size="large" color="#3498DB" />
      ) : (
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={category}
            onValueChange={onCategoryChange}
            style={styles.picker}
            dropdownIconColor="#3498DB"
          >
            <Picker.Item label="Selecione uma categoria" value="" />
            {categories.map((cat) => (
              <Picker.Item key={cat.id} label={cat.nome} value={cat.id.toString()} />
            ))}
          </Picker>
        </View>
      )}
      <TouchableOpacity style={styles.addButton} onPress={onSubmit}>
        <Text style={styles.addButtonText}>Adicionar Receita</Text>
      </TouchableOpacity>

      <Modal visible={calendarVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.calendarBox}>
            <Calendar
              onDayPress={(day) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const selectedDate = new Date(day.dateString);
                selectedDate.setHours(0, 0, 0, 0);

                if (selectedDate > today) {
                  Alert.alert('Erro', 'Não é possível selecionar uma data futura');
                  return;
                }

                onDateChange(day.dateString);
                setCalendarVisible(false);
              }}
              monthFormat={'MMMM yyyy'}
              hideArrows={false}
              hideExtraDays={true}
              firstDay={0}
              enableSwipeMonths={true}
              markedDates={{
                [date]: {selected: true, selectedColor: '#3498DB'}
              }}
              theme={{
                textMonthFontWeight: 'bold',
                textMonthFontSize: 16,
                monthTextColor: '#3498DB',
                textSectionTitleColor: '#3498DB',
                todayTextColor: '#FF0000',
                dayTextColor: '#2d4150',
                textDisabledColor: '#d9e1e8',
                arrowColor: '#3498DB',
              }}
            />
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={() => setCalendarVisible(false)}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    height: 45,
    borderColor: '#BDC3C7',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#ECF0F1',
    justifyContent: 'center', // Mantém a centralização vertical
  },
  dateText: {
    textAlign: 'left', // Alinha o texto à esquerda
    color: '#2C3E50', // Cor mais escura para melhor legibilidade
    fontSize: 14, // Tamanho da fonte consistente
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#BDC3C7',
    borderRadius: 8,
    backgroundColor: '#ECF0F1',
    marginBottom: 10,
    overflow: 'hidden',
    paddingHorizontal: 5, // Adicionado para evitar corte no texto
  },
  picker: {
    height: 50, // Aumentado para evitar corte
    color: '#34495E',
    fontSize: 16, // Adicionado para melhorar a legibilidade
  },
  addButton: {
    backgroundColor: '#3498DB',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
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
  cancelButton: {
    backgroundColor: '#888',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 