import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, 
  ActivityIndicator, KeyboardAvoidingView, ScrollView, Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { RootStackParamList, RootNavigationProp } from '../../navigation/types';
import { authService } from '../../services/auth';
import { useAuthStore } from '../../store/useAuthStore';

type OTPVerificationRouteProp = RouteProp<RootStackParamList, 'OTPVerification'>;

export const OTPVerificationScreen = () => {
  const route = useRoute<OTPVerificationRouteProp>();
  const navigation = useNavigation<RootNavigationProp>();
  const { mobile, name, isSignUp } = route.params;
  
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore(state => state.login);

  const handleVerify = async () => {
    if (otp.length < 4) {
      Alert.alert('Error', 'Please enter a valid OTP');
      return;
    }
    
    setLoading(true);
    try {
      const isValid = await authService.verifyOTP(mobile, otp);
      if (isValid) {
        // Log the user in
        login({ mobile, name: isSignUp ? name : 'User' });
        navigation.navigate('Home');
      } else {
        Alert.alert('Error', 'Invalid OTP');
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoiding} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} bounces={false}>
          <View style={styles.card}>
            <Text style={styles.title}>Verify Mobile</Text>
            <Text style={styles.subtitle}>Enter the OTP sent to {mobile}</Text>
            <Text style={styles.hint}>Hint: Use 1234 for testing</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter OTP"
              keyboardType="number-pad"
              value={otp}
              onChangeText={setOtp}
              maxLength={6}
            />

            <TouchableOpacity style={styles.button} onPress={handleVerify} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Verify & Login</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },
  keyboardAvoiding: { flex: 1 },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  card: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#ffffff',
    padding: 40,
    borderRadius: 24,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.05,
    shadowRadius: 32,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  title: { fontSize: 32, fontWeight: '800', marginBottom: 8, color: '#0f172a', letterSpacing: -0.5 },
  subtitle: { fontSize: 16, color: '#64748b', marginBottom: 8 },
  hint: { fontSize: 13, color: '#94a3b8', marginBottom: 40 },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 16,
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 32,
    backgroundColor: '#f8fafc',
    textAlign: 'center',
    letterSpacing: 12,
  },
  button: {
    backgroundColor: '#6366f1',
    padding: 16,
    borderRadius: 999,
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },
});
