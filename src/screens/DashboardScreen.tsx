import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useOrdenes from '../hooks/useOrdenes';
import useRestaurantes from '../hooks/useRestaurantes';
import type { Orden, OrderStatus } from '../types/index';

const STATUS_COLORS: Record<OrderStatus, { bg: string; text: string }> = {
  pendiente: { bg: '#fef9c3', text: '#a16207' },
  preparando: { bg: '#dbeafe', text: '#1d4ed8' },
  enviado: { bg: '#f3e8ff', text: '#7e22ce' },
  entregado: { bg: '#dcfce7', text: '#166534' },
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  pendiente: 'Pendiente',
  preparando: 'Preparando',
  enviado: 'Enviado',
  entregado: 'Entregado',
};

const NEXT_STATUS: Record<OrderStatus, OrderStatus> = {
  pendiente: 'preparando',
  preparando: 'enviado',
  enviado: 'entregado',
  entregado: 'entregado',
};

export default function DashboardScreen() {
  const { ordenes, actualizarStatusOrden, isLoading } = useOrdenes();
  const { restaurantes } = useRestaurantes();
  const [selectedOrden, setSelectedOrden] = useState<Orden | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const stats = {
    total: ordenes.length,
    pendiente: ordenes.filter((o) => o.status === 'pendiente').length,
    preparando: ordenes.filter((o) => o.status === 'preparando').length,
    enviado: ordenes.filter((o) => o.status === 'enviado').length,
    entregado: ordenes.filter((o) => o.status === 'entregado').length,
    ingresos: ordenes.reduce((sum, o) => sum + o.total_pedido, 0),
  };

  const getRestauranteName = (id: string) =>
    restaurantes.find((r) => r.id === id)?.nombre ?? 'Desconocido';

  const handleStatusChange = async (orden: Orden) => {
    if (orden.status === 'entregado') return;
    setIsUpdating(true);
    try {
      await actualizarStatusOrden(orden.id, NEXT_STATUS[orden.status]);
      setSelectedOrden(null);
    } catch {
      Alert.alert('Error', 'No se pudo actualizar el estado');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.pageTitle}>Dashboard de Órdenes</Text>

      {/* Stats */}
      <View style={styles.statsGrid}>
        {[
          { label: 'Total', value: stats.total, color: '#3b82f6' },
          { label: 'Pendientes', value: stats.pendiente, color: '#eab308' },
          { label: 'Preparando', value: stats.preparando, color: '#6366f1' },
          { label: 'Enviados', value: stats.enviado, color: '#8b5cf6' },
          { label: 'Entregados', value: stats.entregado, color: '#22c55e' },
        ].map((s) => (
          <View key={s.label} style={[styles.statCard, { borderLeftColor: s.color }]}>
            <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
        <View style={[styles.statCard, { borderLeftColor: '#ea580c' }]}>
          <Text style={[styles.statValue, { color: '#ea580c' }]}>
            ${stats.ingresos.toFixed(2)}
          </Text>
          <Text style={styles.statLabel}>Ingresos</Text>
        </View>
      </View>

      {/* Lista de Órdenes */}
      <Text style={styles.sectionTitle}>Órdenes Recientes</Text>
      {isLoading ? (
        <ActivityIndicator color="#ea580c" style={{ marginTop: 20 }} />
      ) : (
        ordenes.map((orden) => (
          <TouchableOpacity
            key={orden.id}
            style={styles.ordenCard}
            onPress={() => setSelectedOrden(orden)}
          >
            <View style={styles.ordenHeader}>
              <Text style={styles.ordenNumero}>{orden.numero_de_orden}</Text>
              <View style={[styles.badge, { backgroundColor: STATUS_COLORS[orden.status].bg }]}>
                <Text style={[styles.badgeText, { color: STATUS_COLORS[orden.status].text }]}>
                  {STATUS_LABELS[orden.status]}
                </Text>
              </View>
            </View>
            <Text style={styles.ordenCliente}>{orden.nombre_cliente}</Text>
            <Text style={styles.ordenRestaurante}>{getRestauranteName(orden.restaurantId)}</Text>
            <View style={styles.ordenFooter}>
              <Text style={styles.ordenTotal}>${orden.total_pedido.toFixed(2)}</Text>
              <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
            </View>
          </TouchableOpacity>
        ))
      )}

      {/* Modal detalle */}
      <Modal visible={!!selectedOrden} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {selectedOrden && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectedOrden.numero_de_orden}</Text>
                  <TouchableOpacity onPress={() => setSelectedOrden(null)}>
                    <Ionicons name="close" size={24} color="#6b7280" />
                  </TouchableOpacity>
                </View>

                {[
                  ['Cliente', selectedOrden.nombre_cliente],
                  ['Dirección', selectedOrden.direccion_cliente],
                  ['Restaurante', getRestauranteName(selectedOrden.restaurantId)],
                  ['Total', `$${selectedOrden.total_pedido.toFixed(2)}`],
                  ['Comentario', selectedOrden.comentario || '—'],
                ].map(([label, value]) => (
                  <View key={label} style={styles.detailRow}>
                    <Text style={styles.detailLabel}>{label}</Text>
                    <Text style={styles.detailValue}>{value}</Text>
                  </View>
                ))}

                <View style={[styles.badge, { backgroundColor: STATUS_COLORS[selectedOrden.status].bg, alignSelf: 'flex-start', marginBottom: 16 }]}>
                  <Text style={[styles.badgeText, { color: STATUS_COLORS[selectedOrden.status].text }]}>
                    {STATUS_LABELS[selectedOrden.status]}
                  </Text>
                </View>

                {selectedOrden.status !== 'entregado' && (
                  <TouchableOpacity
                    style={[styles.updateBtn, isUpdating && { opacity: 0.6 }]}
                    onPress={() => handleStatusChange(selectedOrden)}
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.updateBtnText}>
                        Avanzar a "{STATUS_LABELS[NEXT_STATUS[selectedOrden.status]]}"
                      </Text>
                    )}
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  content: { padding: 16, paddingBottom: 90 },
  pageTitle: { fontSize: 22, fontWeight: 'bold', color: '#111827', marginBottom: 16 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    borderLeftWidth: 4,
    minWidth: '30%',
    flex: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: { fontSize: 20, fontWeight: 'bold' },
  statLabel: { fontSize: 11, color: '#6b7280', marginTop: 2 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#111827', marginBottom: 12 },
  ordenCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  ordenHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  ordenNumero: { fontSize: 14, fontWeight: 'bold', color: '#111827' },
  badge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  badgeText: { fontSize: 11, fontWeight: '600' },
  ordenCliente: { fontSize: 14, color: '#374151', marginBottom: 2 },
  ordenRestaurante: { fontSize: 12, color: '#6b7280', marginBottom: 8 },
  ordenFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ordenTotal: { fontSize: 15, fontWeight: 'bold', color: '#ea580c' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  detailLabel: { fontSize: 13, color: '#6b7280', fontWeight: '500' },
  detailValue: { fontSize: 13, color: '#111827', flex: 1, textAlign: 'right' },
  updateBtn: { backgroundColor: '#ea580c', borderRadius: 10, height: 48, alignItems: 'center', justifyContent: 'center' },
  updateBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});
