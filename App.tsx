import React, {useState} from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';

import {
  initCycurid,
  CycurIdType,
  CycuridConfig,
} from 'react-native-cycurid-sdk';

import {MERCHANT_API_KEY, MERCHANT_SECRET_KEY, USER_ID} from '@env';
export default function App() {
  const [livenessResult, setLivenessResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeButton, setActiveButton] = useState<CycurIdType | null>(null);

  const apiKey = MERCHANT_API_KEY || 'default_api_key';
  const secretKey = MERCHANT_SECRET_KEY || 'default_secret_key';
  const userID = USER_ID || 'default_user_id';

  const handleButtonPress = async (type: CycurIdType) => {
    setIsLoading(true);
    setActiveButton(type);
    const config = new CycuridConfig(apiKey, secretKey, userID);

    try {
      const result = await initCycurid(type, config);
      setLivenessResult(result);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
      setActiveButton(null); // Reset active button after the process is completed
    }
  };

  return (
    <View style={styles.container}>
      <Text>Current User ID: {userID}</Text>
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
              isLoading && type === activeButton ? styles.disabledButton : {},
            ]}
            onPress={() => handleButtonPress(type)}
            disabled={isLoading && type === activeButton}>
            {isLoading && type === activeButton ? (
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
          <Text style={styles.resultText}>
            {JSON.stringify(livenessResult, null, 2)}
          </Text>
        </ScrollView>
      )}
    </View>
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
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    maxHeight: 200, // Limit height so it doesn’t overflow the screen
    width: '90%',
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 5,
  },
  resultText: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'monospace', // Optional: Makes JSON look like code
  },
});
