import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen() {
  const { user, logout } = useAuth();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>¡Pide comida fácil{'\n'}como nunca!</Text>
        <Text style={styles.heroSubtitle}>
          FoodPlease es la plataforma más rápida y confiable para pedir comida.
        </Text>
      </View>

      {/* Info del usuario */}
      <View style={styles.userCard}>
        <View style={styles.userCardRow}>
          <Ionicons name="person-circle-outline" size={40} color="#ea580c" />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={styles.userName}>Hola, {user?.nombre} 👋</Text>
            <Text style={styles.userRole}>
              {user?.rol === 'admin' ? 'Administrador' : 'Cliente'}
            </Text>
          </View>
          <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
            <Ionicons name="log-out-outline" size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Features */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>¿Por qué FoodPlease?</Text>
        {[
          { icon: 'time-outline', title: 'Entrega Rápida', desc: 'Recibe tu orden en 30-45 minutos' },
          { icon: 'location-outline', title: 'Amplia Cobertura', desc: 'Disponible en toda la ciudad' },
          { icon: 'bag-handle-outline', title: 'Muchas Opciones', desc: 'Miles de platillos para elegir' },
          { icon: 'shield-checkmark-outline', title: 'Pagos Seguros', desc: 'Tus datos están protegidos' },
        ].map((feature) => (
          <View key={feature.title} style={styles.featureRow}>
            <View style={styles.featureIcon}>
              <Ionicons name={feature.icon as keyof typeof Ionicons.glyphMap} size={22} color="#ea580c" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDesc}>{feature.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      {user?.rol === 'admin' && (
        <View style={styles.adminBadge}>
          <Ionicons name="shield-outline" size={16} color="#7c3aed" />
          <Text style={styles.adminText}>
            Tienes acceso al Dashboard y gestión de restaurantes
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff7ed',
  },
  content: {
    padding: 20,
    paddingBottom: 90,
  },
  hero: {
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ea580c',
    lineHeight: 40,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 15,
    color: '#6b7280',
    lineHeight: 22,
  },
  userCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  userCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  userRole: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  logoutBtn: {
    padding: 8,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#fff7ed',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  featureDesc: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 1,
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ede9fe',
    borderRadius: 10,
    padding: 12,
    gap: 8,
  },
  adminText: {
    fontSize: 13,
    color: '#7c3aed',
    flex: 1,
  },
});
