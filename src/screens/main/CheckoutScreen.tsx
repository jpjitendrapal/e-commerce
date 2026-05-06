import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TextInput, 
  TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useOrderStore } from '../../store/useOrderStore';
import { useToastStore } from '../../store/useToastStore';
import { MainLayout } from '../../components/MainLayout';
import { RootNavigationProp } from '../../navigation/types';
import { ENV } from '../../config/env';
import { Ionicons } from '@expo/vector-icons';

export const CheckoutScreen = () => {
  const navigation = useNavigation<RootNavigationProp>();
  const { user, savedAddress, saveAddress } = useAuthStore();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { addOrder } = useOrderStore();
  const { showToast } = useToastStore();

  const [isEditing, setIsEditing] = useState(!savedAddress);
  const [form, setForm] = useState({
    fullName: savedAddress?.fullName || user?.name || '',
    address: savedAddress?.address || '',
    city: savedAddress?.city || '',
    state: savedAddress?.state || '',
    zip: savedAddress?.zip || '',
    phone: savedAddress?.phone || user?.mobile || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Sync form when savedAddress is loaded (e.g. from AsyncStorage in App.tsx)
  React.useEffect(() => {
    if (savedAddress) {
      setForm({
        fullName: savedAddress.fullName,
        address: savedAddress.address,
        city: savedAddress.city,
        state: savedAddress.state,
        zip: savedAddress.zip,
        phone: savedAddress.phone,
      });
      setIsEditing(false);
    }
  }, [savedAddress]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!form.fullName.trim()) newErrors.fullName = 'Name is required';
    if (!form.address.trim()) newErrors.address = 'Address is required';
    if (!form.city.trim()) newErrors.city = 'City is required';
    if (!form.state.trim()) newErrors.state = 'State is required';
    if (!form.zip.trim()) newErrors.zip = 'ZIP/PIN is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (isEditing && !validateForm()) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Save order
      const newOrder = {
        id: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        date: new Date().toISOString(),
        items: [...items],
        total: getTotalPrice(),
        status: 'Processing' as const,
      };
      addOrder(newOrder);

      // Save address for future use
      saveAddress(form);

      showToast('Order placed successfully!', 'success');
      clearCart(false);
      navigation.navigate('Home');
    } catch (error) {
      showToast('Failed to place order', 'error');
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (label: string, field: keyof typeof form, placeholder: string, options = {}) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, errors[field] ? styles.inputError : null]}
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        value={form[field]}
        onChangeText={(text) => {
          setForm({ ...form, [field]: text });
          if (errors[field]) setErrors({ ...errors, [field]: '' });
        }}
        {...options}
      />
      {!!errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
    </View>
  );

  return (
    <MainLayout showSearch={false} showCategories={false}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={24} color="#0f172a" />
            </TouchableOpacity>
            <Text style={styles.title}>Checkout</Text>
          </View>
          
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Shipping Details</Text>
            {savedAddress && !isEditing && (
              <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.editBtn}>
                <Ionicons name="create-outline" size={20} color="#6366f1" />
                <Text style={styles.editBtnText}>Edit</Text>
              </TouchableOpacity>
            )}
          </View>

          {!isEditing ? (
            <TouchableOpacity 
              style={styles.savedAddressCard}
              onPress={() => setIsEditing(true)}
              activeOpacity={0.7}
            >
              <View style={styles.addressInfo}>
                <Text style={styles.customerName}>{form.fullName}</Text>
                <Text style={styles.addressText}>{form.address}</Text>
                <Text style={styles.addressText}>{form.city}, {form.state} - {form.zip}</Text>
                <Text style={styles.phoneText}>📞 {form.phone}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
            </TouchableOpacity>
          ) : (
            <View style={styles.card}>
              {renderInput('Full Name', 'fullName', 'Enter your full name')}
              {renderInput('Phone Number', 'phone', 'Mobile number', { keyboardType: 'phone-pad', editable: false })}
              {renderInput('Address', 'address', 'House no, Street, Area')}
              
              <View style={styles.row}>
                <View style={{ flex: 1, marginRight: 12 }}>
                  {renderInput('City', 'city', 'City')}
                </View>
                <View style={{ flex: 1 }}>
                  {renderInput('State', 'state', 'State')}
                </View>
              </View>
              
              {renderInput('ZIP / PIN Code', 'zip', '6-digit code', { keyboardType: 'number-pad', maxLength: 6 })}

              {savedAddress && (
                <TouchableOpacity 
                  style={styles.cancelBtn} 
                  onPress={() => {
                    setForm({
                      fullName: savedAddress.fullName,
                      address: savedAddress.address,
                      city: savedAddress.city,
                      state: savedAddress.state,
                      zip: savedAddress.zip,
                      phone: savedAddress.phone,
                    });
                    setIsEditing(false);
                    setErrors({});
                  }}
                >
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Order Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Items</Text>
              <Text style={styles.summaryValue}>{items.length}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>{ENV.CURRENCY_SYMBOL}{getTotalPrice().toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping</Text>
              <Text style={[styles.summaryValue, { color: '#10b981' }]}>Free</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>{ENV.CURRENCY_SYMBOL}{getTotalPrice().toFixed(2)}</Text>
            </View>

            <TouchableOpacity 
              style={[styles.placeOrderBtn, loading && styles.disabledBtn]} 
              onPress={handlePlaceOrder}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.placeOrderBtnText}>Place Order</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  scrollContainer: { 
    paddingBottom: 60, 
    backgroundColor: '#f8fafc',
    width: '100%',
    maxWidth: 1000,
    alignSelf: 'center',
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#ffffff',
    gap: 16,
    marginBottom: 24,
  },
  backBtn: { padding: 4 },
  title: { fontSize: 24, fontWeight: '900', color: '#0f172a', letterSpacing: -0.5 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: 1 },
  editBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 4, paddingHorizontal: 8 },
  editBtnText: { fontSize: 14, fontWeight: '700', color: '#6366f1' },
  savedAddressCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  addressInfo: { flex: 1 },
  customerName: { fontSize: 17, fontWeight: '800', color: '#1e293b', marginBottom: 6 },
  addressText: { fontSize: 14, color: '#64748b', marginBottom: 2, lineHeight: 20, fontWeight: '500' },
  phoneText: { fontSize: 14, color: '#475569', marginTop: 8, fontWeight: '600' },
  card: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 24,
  },
  inputContainer: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '700', color: '#475569', marginBottom: 8, marginLeft: 4 },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: '#1e293b',
  },
  inputError: { borderColor: '#ef4444' },
  errorText: { color: '#ef4444', fontSize: 12, marginTop: 4, marginLeft: 4, fontWeight: '600' },
  row: { flexDirection: 'row' },
  cancelBtn: { paddingVertical: 12, alignItems: 'center', marginTop: 8 },
  cancelBtnText: { color: '#64748b', fontSize: 14, fontWeight: '700' },
  summaryCard: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 20,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  summaryTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a', marginBottom: 20 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  summaryLabel: { fontSize: 15, color: '#64748b', fontWeight: '500' },
  summaryValue: { fontSize: 15, color: '#0f172a', fontWeight: '700' },
  divider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 16 },
  totalLabel: { fontSize: 18, color: '#0f172a', fontWeight: '800' },
  totalValue: { fontSize: 24, color: '#6366f1', fontWeight: '900' },
  placeOrderBtn: {
    backgroundColor: '#6366f1',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  disabledBtn: { opacity: 0.7 },
  placeOrderBtnText: { color: '#ffffff', fontSize: 16, fontWeight: '800', letterSpacing: 0.5 },
});
