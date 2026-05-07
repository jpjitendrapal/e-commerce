import React from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity, Pressable, Modal, TouchableWithoutFeedback } from 'react-native';
import Logo from '../../assets/favicon.png';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ENV } from '../config/env';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';
import { useOrderStore } from '../store/useOrderStore';
import { useToastStore } from '../store/useToastStore';
import { RootNavigationProp } from '../navigation/types';
import useDeviceWidth from '../utils/useDeviceWidth';

type HeaderProps = {
  centerComponent?: React.ReactNode;
};

export const Header = ({ centerComponent }: HeaderProps) => {
  const { isAuthenticated, logout, user } = useAuthStore();
  const { getTotalItems, clearCart } = useCartStore();
  const { clearOrders } = useOrderStore();
  const { showToast } = useToastStore();
  const navigation = useNavigation<RootNavigationProp>();
  const deviceWidth = useDeviceWidth();
  const cartItemCount = getTotalItems();
  const [isMenuVisible, setIsMenuVisible] = React.useState(false);

  const isMobile = deviceWidth === 'sm';
  const isSmallMobile = deviceWidth === 'sm';

  return (
    <View style={[styles.container, isMobile && styles.containerMobile]}>
      <Pressable
        onPress={() => navigation.navigate('Home')}
        style={[styles.left, isMobile && styles.leftMobile]}
      >
        <Image
          source={Logo}
          style={[styles.logo, isMobile && styles.logoMobile]}
          resizeMode="contain"
        />
        {!isSmallMobile && (
          <Text style={[styles.appName, isMobile && styles.appNameMobile]}>
            {ENV.APP_NAME}
          </Text>
        )}
      </Pressable>

      {centerComponent && (
        <View style={[styles.center, isMobile && styles.centerMobile]}>
          {centerComponent}
        </View>
      )}

      <View style={[styles.right, isMobile && styles.rightMobile]}>
        <View style={styles.userSection}>
          <TouchableOpacity 
            onPress={() => {
              if (isAuthenticated) {
                setIsMenuVisible(!isMenuVisible);
              } else {
                navigation.navigate('Login');
              }
            }} 
            style={styles.iconButton}
          >
            <Ionicons name="person-outline" size={22} color="#0f172a" />
            {!isMobile && <Text style={styles.userName}>Account</Text>}
          </TouchableOpacity>

          {isMenuVisible && isAuthenticated && (
            <Modal
              transparent={true}
              visible={isMenuVisible}
              onRequestClose={() => setIsMenuVisible(false)}
            >
              <TouchableWithoutFeedback onPress={() => setIsMenuVisible(false)}>
                <View style={styles.modalOverlay}>
                  <View style={[styles.dropdown, isMobile && styles.dropdownMobile]}>
                    <Text style={styles.menuHeader}>Hi, {user?.name || 'User'}</Text>
                    <View style={styles.divider} />
                    
                    <TouchableOpacity 
                      style={styles.menuItem}
                      onPress={() => {
                        setIsMenuVisible(false);
                        navigation.navigate('Profile');
                      }}
                    >
                      <Ionicons name="person-circle-outline" size={20} color="#475569" />
                      <Text style={styles.menuText}>My Profile</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={styles.menuItem}
                      onPress={() => {
                        setIsMenuVisible(false);
                        navigation.navigate('Orders');
                      }}
                    >
                      <Ionicons name="receipt-outline" size={20} color="#475569" />
                      <Text style={styles.menuText}>My Orders</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={styles.menuItem}
                      onPress={() => {
                        setIsMenuVisible(false);
                        logout();
                        clearCart(false);
                        clearOrders();
                        showToast('Logged out successfully', 'info');
                        navigation.navigate('Home');
                      }}
                    >
                      <Ionicons name="log-out-outline" size={20} color="#ef4444" />
                      <Text style={[styles.menuText, { color: '#ef4444' }]}>Logout</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          )}

          <TouchableOpacity 
            onPress={() => navigation.navigate('GQLProducts')} 
            style={styles.iconButton}
          >
            <Ionicons name="server-outline" size={22} color="#0f172a" />
            {!isMobile && <Text style={styles.userName}>MySQL</Text>}
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => navigation.navigate('Cart')} 
            style={styles.iconButton}
          >
            <View>
              <Ionicons name="cart-outline" size={24} color="#0f172a" />
              {cartItemCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cartItemCount}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
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
  containerMobile: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    gap: 8,
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minWidth: 100,
  },
  leftMobile: {
    flex: 0,
    minWidth: 40,
  },
  center: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerMobile: {
    flex: 3,
  },
  right: {
    flex: 1,
    alignItems: 'flex-end',
    minWidth: 100,
  },
  rightMobile: {
    flex: 0,
    minWidth: 80,
  },
  logo: {
    width: 32,
    height: 32,
  },
  logoMobile: {
    width: 28,
    height: 28,
  },
  appName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  appNameMobile: {
    fontSize: 18,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -8,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#ffffff',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  dropdown: {
    position: 'absolute',
    top: 70,
    right: 60,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 8,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  dropdownMobile: {
    right: 20,
    top: 60,
  },
  menuHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderRadius: 8,
  },
  menuText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
});
