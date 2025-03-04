import React, {useState} from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';

import {
  initCycurid,
  CycurIdType,
  CycuridConfig,
} from 'react-native-cycurid-sdk';

import {MERCHANT_API_KEY, MERCHANT_SECRET_KEY} from '@env';

export default function App() {
  const [livenessResult, setLivenessResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeButton, setActiveButton] = useState<CycurIdType | null>(null);
  const [userId, setUserId] = useState<string>('');

  const apiKey = MERCHANT_API_KEY || 'default_api_key';
  const secretKey = MERCHANT_SECRET_KEY || 'default_secret_key';

  const handleButtonPress = async (type: CycurIdType) => {
    if (isLoading) {
      return;
    }

    if (!userId.trim()) {
      Alert.alert(
        'User ID Required',
        'Please enter a User ID. This ID will be linked to your biometrics.',
        [{text: 'OK', onPress: () => console.log('Alert closed')}],
      );
      return;
    }

    setIsLoading(true);
    setActiveButton(type);
    const config = new CycuridConfig(apiKey, secretKey, userId);

    try {
      const result = await initCycurid(type, config);
      setLivenessResult(result);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
      setActiveButton(null);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>User ID:</Text>
          <TextInput
            style={styles.input}
            value={userId}
            onChangeText={setUserId}
            placeholder="Enter User ID"
            placeholderTextColor="#999"
          />
          <Text style={styles.helperText}>
            This userid must be unique and will be linked with your biometrics. (Recommended using email.)
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          {[
            {type: CycurIdType.isHuman, label: 'Is Human', color: 'blue'},
            {type: CycurIdType.onboarding, label: 'Onboarding', color: 'orange'},
            {
              type: CycurIdType.identification,
              label: 'Identification',
              color: 'red',
            },
            {
              type: CycurIdType.dataExtraction,
              label: 'Data Extraction',
              color: 'green',
            },
          ].map(({type, label, color}) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.button,
                {backgroundColor: color},
                isLoading ? styles.disabledButton : {},
              ]}
              onPress={() => handleButtonPress(type)}
              disabled={isLoading}>
              {isLoading && activeButton === type ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>{label}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
        {livenessResult && (
          <ScrollView style={styles.resultContainer}>
            <Text style={styles.resultText}>Result:</Text>
            <Text style={styles.resultText}>{livenessResult}</Text>
          </ScrollView>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    width: 200,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    alignItems: 'center',
    marginVertical: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    maxHeight: 200,
    width: '90%',
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 5,
  },
  resultText: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'monospace',
  },
  inputContainer: {
    width: '90%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 4,
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
});
