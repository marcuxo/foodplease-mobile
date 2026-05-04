import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useOrdenes from '../hooks/useOrdenes';
import useRestaurantes from '../hooks/useRestaurantes';
import type { OrdenFormData } from '../types/index';

const EMPTY_FORM: OrdenFormData = {
  nombre_cliente: '',
  direccion_cliente: '',
  total_pedido: 0,
  restaurantId: '',
  comentario: '',
};

export default function CrearOrdenScreen() {
  const { crearOrden, isLoading: ordersLoading } = useOrdenes();
  const { restaurantes, isLoading: restaurantesLoading } = useRestaurantes();
  const [formData, setFormData] = useState<OrdenFormData>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const isLoading = ordersLoading || restaurantesLoading;

  const handleSubmit = async () => {
    setError(null);
    try {
      await crearOrden(formData);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setFormData(EMPTY_FORM);
      }, 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la orden');
    }
  };

  if (success) {
    return (
      <View style={styles.successContainer}>
        <Ionicons name="checkmark-circle" size={72} color="#22c55e" />
        <Text style={styles.successTitle}>¡Orden Creada!</Text>
        <Text style={styles.successSubtitle}>Tu pedido ha sido registrado exitosamente</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.iconHeader}>
          <Ionicons name="bag-handle-outline" size={40} color="#ea580c" />
          <Text style={styles.pageTitle}>Crear Nueva Orden</Text>
          <Text style={styles.pageSubtitle}>Completa el formulario para hacer tu pedido</Text>
        </View>

        {error && (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={16} color="#ef4444" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Nombre cliente */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre del cliente</Text>
          <TextInput
            style={styles.input}
            placeholder="Tu nombre completo"
            value={formData.nombre_cliente}
            onChangeText={(v) => setFormData((p) => ({ ...p, nombre_cliente: v }))}
            autoCapitalize="words"
          />
        </View>

        {/* Dirección */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Dirección de entrega</Text>
          <TextInput
            style={styles.input}
            placeholder="Dirección donde recibirás tu pedido"
            value={formData.direccion_cliente}
            onChangeText={(v) => setFormData((p) => ({ ...p, direccion_cliente: v }))}
          />
        </View>

        {/* Total */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Total del pedido ($)</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            value={formData.total_pedido === 0 ? '' : String(formData.total_pedido)}
            onChangeText={(v) => setFormData((p) => ({ ...p, total_pedido: parseFloat(v) || 0 }))}
            keyboardType="decimal-pad"
          />
        </View>

        {/* Restaurante */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Restaurante</Text>
          {restaurantesLoading ? (
            <ActivityIndicator color="#ea580c" />
          ) : (
            <View style={styles.pickerContainer}>
              {restaurantes.map((r) => (
                <TouchableOpacity
                  key={r.id}
                  style={[
                    styles.pickerOption,
                    formData.restaurantId === r.id && styles.pickerOptionSelected,
                  ]}
                  onPress={() => setFormData((p) => ({ ...p, restaurantId: r.id }))}
                >
                  <Ionicons
                    name="restaurant-outline"
                    size={16}
                    color={formData.restaurantId === r.id ? '#ea580c' : '#6b7280'}
                  />
                  <Text
                    style={[
                      styles.pickerOptionText,
                      formData.restaurantId === r.id && styles.pickerOptionTextSelected,
                    ]}
                  >
                    {r.nombre}
                  </Text>
                  {formData.restaurantId === r.id && (
                    <Ionicons name="checkmark" size={16} color="#ea580c" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Comentario */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Comentarios (opcional)</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="Instrucciones especiales para tu orden..."
            value={formData.comentario}
            onChangeText={(v) => setFormData((p) => ({ ...p, comentario: v }))}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity
          style={[styles.submitBtn, isLoading && { opacity: 0.6 }]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="bag-check-outline" size={20} color="#fff" />
              <Text style={styles.submitBtnText}>Crear Orden</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff7ed' },
  content: { padding: 20, paddingBottom: 90 },
  iconHeader: { alignItems: 'center', marginBottom: 24 },
  pageTitle: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginTop: 8 },
  pageSubtitle: { fontSize: 14, color: '#6b7280', marginTop: 4, textAlign: 'center' },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    gap: 6,
  },
  errorText: { color: '#b91c1c', fontSize: 13, flex: 1 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 44,
    fontSize: 14,
    color: '#111827',
  },
  textarea: { height: 88, paddingTop: 12 },
  pickerContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    overflow: 'hidden',
  },
  pickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    gap: 8,
  },
  pickerOptionSelected: { backgroundColor: '#fff7ed' },
  pickerOptionText: { flex: 1, fontSize: 14, color: '#374151' },
  pickerOptionTextSelected: { color: '#ea580c', fontWeight: '600' },
  submitBtn: {
    backgroundColor: '#ea580c',
    borderRadius: 12,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  submitBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  successContainer: {
    flex: 1,
    backgroundColor: '#f0fdf4',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  successTitle: { fontSize: 28, fontWeight: 'bold', color: '#111827', marginTop: 16 },
  successSubtitle: { fontSize: 15, color: '#6b7280', marginTop: 8, textAlign: 'center' },
});
