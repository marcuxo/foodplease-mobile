import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useRestaurantes from '../hooks/useRestaurantes';
import type { Restaurante, RestauranteFormData } from '../types/index';

const EMPTY_FORM: RestauranteFormData = { nombre: '', direccion: '', telefono: '' };

export default function RestaurantesScreen() {
  const { restaurantes, isLoading, error, agregarRestaurante, actualizarRestaurante, eliminarRestaurante } =
    useRestaurantes();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<RestauranteFormData>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openAdd = () => {
    setFormData(EMPTY_FORM);
    setEditingId(null);
    setFormError(null);
    setShowModal(true);
  };

  const openEdit = (r: Restaurante) => {
    setFormData({ nombre: r.nombre, direccion: r.direccion, telefono: r.telefono });
    setEditingId(r.id);
    setFormError(null);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    setFormError(null);
    setIsSubmitting(true);
    try {
      if (editingId) {
        await actualizarRestaurante(editingId, formData);
      } else {
        await agregarRestaurante(formData);
      }
      setShowModal(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Error en la operación');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Eliminar restaurante',
      '¿Estás seguro de que deseas eliminar este restaurante?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await eliminarRestaurante(id);
            } catch (err) {
              Alert.alert('Error', err instanceof Error ? err.message : 'Error al eliminar');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.pageTitle}>Restaurantes</Text>
            <Text style={styles.pageSubtitle}>Administra la plataforma</Text>
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={openAdd}>
            <Ionicons name="add" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {error && (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={16} color="#ef4444" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {isLoading ? (
          <ActivityIndicator color="#ea580c" style={{ marginTop: 40 }} />
        ) : (
          restaurantes.map((r) => (
            <View key={r.id} style={styles.card}>
              <View style={styles.cardIcon}>
                <Ionicons name="restaurant" size={24} color="#ea580c" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardName}>{r.nombre}</Text>
                <View style={styles.cardDetail}>
                  <Ionicons name="location-outline" size={12} color="#9ca3af" />
                  <Text style={styles.cardDetailText}>{r.direccion}</Text>
                </View>
                <View style={styles.cardDetail}>
                  <Ionicons name="call-outline" size={12} color="#9ca3af" />
                  <Text style={styles.cardDetailText}>{r.telefono}</Text>
                </View>
              </View>
              <View style={styles.cardActions}>
                <TouchableOpacity onPress={() => openEdit(r)} style={styles.editBtn}>
                  <Ionicons name="pencil" size={16} color="#3b82f6" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(r.id)} style={styles.deleteBtn}>
                  <Ionicons name="trash" size={16} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Modal Formulario */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingId ? 'Editar Restaurante' : 'Nuevo Restaurante'}
              </Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {formError && (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={16} color="#ef4444" />
                <Text style={styles.errorText}>{formError}</Text>
              </View>
            )}

            {([
              { field: 'nombre', label: 'Nombre', placeholder: 'Nombre del restaurante', icon: 'restaurant-outline' },
              { field: 'direccion', label: 'Dirección', placeholder: 'Dirección completa', icon: 'location-outline' },
              { field: 'telefono', label: 'Teléfono', placeholder: 'Número de teléfono', icon: 'call-outline', keyboard: 'phone-pad' },
            ] as const).map(({ field, label, placeholder, icon, keyboard }) => (
              <View key={field} style={styles.inputGroup}>
                <Text style={styles.label}>{label}</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name={icon} size={16} color="#9ca3af" style={{ marginRight: 8 }} />
                  <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    value={formData[field]}
                    onChangeText={(v) => setFormData((prev) => ({ ...prev, [field]: v }))}
                    keyboardType={keyboard as any}
                  />
                </View>
              </View>
            ))}

            <TouchableOpacity
              style={[styles.submitBtn, isSubmitting && { opacity: 0.6 }]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitBtnText}>{editingId ? 'Actualizar' : 'Agregar'}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 90 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  pageTitle: { fontSize: 22, fontWeight: 'bold', color: '#111827' },
  pageSubtitle: { fontSize: 13, color: '#6b7280', marginTop: 2 },
  addBtn: {
    backgroundColor: '#ea580c',
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    gap: 6,
  },
  errorText: { color: '#b91c1c', fontSize: 13, flex: 1 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#fff7ed',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardName: { fontSize: 14, fontWeight: 'bold', color: '#111827', marginBottom: 4 },
  cardDetail: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  cardDetailText: { fontSize: 12, color: '#6b7280', flex: 1 },
  cardActions: { flexDirection: 'column', gap: 8, marginLeft: 8 },
  editBtn: { padding: 6, backgroundColor: '#eff6ff', borderRadius: 8 },
  deleteBtn: { padding: 6, backgroundColor: '#fef2f2', borderRadius: 8 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  inputGroup: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#f9fafb',
  },
  input: { flex: 1, height: 44, fontSize: 14, color: '#111827' },
  submitBtn: {
    backgroundColor: '#ea580c',
    borderRadius: 10,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  submitBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});
