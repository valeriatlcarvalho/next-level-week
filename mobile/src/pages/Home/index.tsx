import React, { useState, useEffect, ChangeEvent } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { StyleSheet, Image, Text, ImageBackground, View, Platform, KeyboardAvoidingView } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import PickerSelect from 'react-native-picker-select';
import axios from 'axios';

interface IBGEUFResponse {
  id: number;
  sigla: string;
}

interface IBGECityResponse {
  id: number;
  nome: string;
}

interface SelectItem {
  label: string;
  value: string;
}

const Home = () => {
  const [ufs, setUfs] = useState<SelectItem[]>([]);
  const [cities, setCities] = useState<SelectItem[]>([]);
  const navigation = useNavigation();

  const [selectedUf, setSelectedUf] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');

  useEffect(() => {
    async function loadUfs() {
      await axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome').then(response => {
        const ufInitials: SelectItem[] = response.data.map(uf => ({
          label: uf.sigla,
          value: uf.sigla,
          key: String(uf.id),
        }));
        setUfs(ufInitials);
      });
    }
    loadUfs();
  }, []);

  useEffect(() => {
    if (selectedUf === '0') {
      return;
    }

    async function loadCities() {
      await axios
        .get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios?orderBy=nome`)
        .then(response => {
          const cityNames = response.data.map(city => ({
            label: city.nome,
            value: city.nome,
            key: String(city.id),
          }));
          setCities(cityNames);
        });
    }
    loadCities();
  }, [selectedUf]);

  function handleSelectUf(value: any) {
    const uf = value;
    setSelectedUf(uf);
  }

  function handleSelectCity(value: any) {
    const city = value;
    setSelectedCity(city);
  }

  function handleNavigateToPoints() {
    navigation.navigate('Points', {
      uf: selectedUf,
      city: selectedCity,
    });
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ImageBackground
        source={require('../../assets/home-background.png')}
        style={styles.container}
        imageStyle={{ width: 274, height: 368 }}
      >
        <View style={styles.main}>
          <Image source={require('../../assets/logo.png')} />
          <View>
            <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
            <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <PickerSelect
            style={
              Platform.OS === 'ios'
                ? {
                  inputIOS: styles.select,
                  viewContainer: {
                    borderRadius: 10,
                  }
                }
                : {
                  inputAndroid: styles.select,
                  viewContainer: {
                    borderRadius: 10,
                  }
                }
            }
            onValueChange={handleSelectUf}
            placeholder={{ label: 'Selecione uma UF', value: null }}
            items={ufs}
          />
          <PickerSelect
            style={
              Platform.OS === 'ios'
                ? {
                  inputIOS: styles.select,
                  viewContainer: {
                    borderRadius: 10,
                  }
                }
                : {
                  inputAndroid: styles.select,
                  viewContainer: {
                    borderRadius: 10,
                  }
                }
            }
            onValueChange={handleSelectCity}
            placeholder={{ label: 'Selecione uma cidade', value: null }}
            items={cities}
          />
          <RectButton style={styles.button} onPress={handleNavigateToPoints}>
            <View style={styles.buttonIcon}>
              <Text>
                <Icon name="arrow-right" color="#ffffff" size={24} />
              </Text>
            </View>
            <Text style={styles.buttonText}>
              Entrar
            </Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {
    marginBottom: 8,
    paddingHorizontal: 24,
    height: 60,
    fontSize: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ffffff',
    borderRadius: 10,
  },

  input: {
    height: 60,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#ffffff',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

export default Home;
