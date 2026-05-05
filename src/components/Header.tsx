import React from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ENV } from '../config/env';
import { useAuthStore } from '../store/useAuthStore';
import { RootNavigationProp } from '../navigation/types';

type HeaderProps = {
  centerComponent?: React.ReactNode;
};

export const Header = ({ centerComponent }: HeaderProps) => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigation = useNavigation<RootNavigationProp>();

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {ENV.LOGO_URL ? (
          <Image
            source={{ uri: ENV.LOGO_URL }}
            style={styles.logo}
            resizeMode="contain"
          />
        ) : (
          <Text style={styles.appName}>{ENV.APP_NAME}</Text>
        )}
      </View>

      {centerComponent && (
        <View style={styles.center}>
          {centerComponent}
        </View>
      )}

      <View style={styles.right}>
        {isAuthenticated ? (
          <View style={styles.userSection}>
            <Text style={styles.userName}>Account</Text>
            <TouchableOpacity onPress={logout} style={styles.authButton}>
              <Text style={styles.authButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.userSection}>
            <Text style={styles.userName}>Account</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.authButton}>
              <Text style={styles.authButtonText}>Login</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 18,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    gap: 16,
  },
  left: {
    flex: 1,
    alignItems: 'flex-start',
    minWidth: 120,
  },
  center: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  right: {
    flex: 1,
    alignItems: 'flex-end',
    minWidth: 120,
  },
  logo: {
    width: 160,
    height: 44,
  },
  appName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  userName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#64748b',
    display: 'flex',
  },
  authButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#6366f1',
    borderRadius: 8,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  authButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
