import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, KeyboardAvoidingView, ScrollView, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RootNavigationProp } from '../../navigation/types';
import { authService } from '../../services/auth';
import { useToastStore } from '../../store/useToastStore';
import { useAuthStore } from '../../store/useAuthStore';
import { validateIndianMobile } from '../../utils/validation';

export const LoginScreen = () => {
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const route = useRoute<any>();
  const navigation = useNavigation<RootNavigationProp>();
  const redirectTo = route.params?.redirectTo;

  const { showToast } = useToastStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      navigation.navigate('Home');
    }
  }, [isAuthenticated, navigation]);

  const handleLogin = async () => {
    setError('');
    if (!validateIndianMobile(mobile)) {
      setError('Please enter a valid 10-digit Indian mobile number');
      return;
    }
    setLoading(true);
    try {
      await authService.sendOTP(mobile);
      showToast('OTP sent successfully!', 'success');
      navigation.navigate('OTPVerification', { mobile, isSignUp: false, redirectTo });
    } catch (e) {
      showToast('Failed to send OTP. Please try again.', 'error');
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
            <Text style={styles.title}>Login</Text>
            <Text style={styles.subtitle}>Enter your mobile number to login</Text>

            <TextInput
              style={[styles.input, error ? styles.inputError : null]}
              placeholder="Mobile Number"
              keyboardType="phone-pad"
              placeholderTextColor="#94a3b8"
              value={mobile}
              onChangeText={(text) => {
                setMobile(text);
                if (error) setError('');
              }}
              maxLength={10}
            />
            {!!error && <Text style={styles.errorText}>{error}</Text>}

            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Send OTP</Text>
              )}
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.linkText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
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
  subtitle: { fontSize: 16, color: '#64748b', marginBottom: 40 },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1e293b',
    marginBottom: 12,
    backgroundColor: '#f8fafc',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: -8,
    marginBottom: 12,
    marginLeft: 4,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#6366f1',
    padding: 16,
    borderRadius: 999,
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 12,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },
  footer: { flexDirection: 'row', justifyContent: 'center' },
  footerText: { fontSize: 15, color: '#64748b' },
  linkText: { fontSize: 15, color: '#6366f1', fontWeight: '700' },
});
