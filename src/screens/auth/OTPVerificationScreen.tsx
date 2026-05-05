import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  ActivityIndicator, KeyboardAvoidingView, ScrollView, Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { RootStackParamList, RootNavigationProp } from '../../navigation/types';
import { authService } from '../../services/auth';
import { useAuthStore } from '../../store/useAuthStore';
import { useToastStore } from '../../store/useToastStore';

type OTPVerificationRouteProp = RouteProp<RootStackParamList, 'OTPVerification'>;

export const OTPVerificationScreen = () => {
  const route = useRoute<OTPVerificationRouteProp>();
  const navigation = useNavigation<RootNavigationProp>();
  const { mobile, name, isSignUp } = route.params;
  
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore(state => state.login);
  const { showToast } = useToastStore();

  const handleVerify = async () => {
    setError('');
    if (otp.length < 4) {
      setError('Please enter a valid OTP');
      return;
    }
    
    setLoading(true);
    try {
      const isValid = await authService.verifyOTP(mobile, otp);
      if (isValid) {
        showToast('Login successful!', 'success');
        login({ mobile, name: isSignUp ? name : 'User' });
        navigation.navigate('Home');
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } catch (e) {
      showToast('Verification failed. Please try again.', 'error');
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
              style={[styles.input, error ? styles.inputError : null]}
              placeholder="Enter OTP"
              keyboardType="number-pad"
              value={otp}
              onChangeText={(text) => {
                setOtp(text);
                if (error) setError('');
              }}
              maxLength={6}
            />
            {!!error && <Text style={styles.errorText}>{error}</Text>}

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
    marginBottom: 12,
    backgroundColor: '#f8fafc',
    textAlign: 'center',
    letterSpacing: 12,
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginTop: -8,
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: '600',
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
