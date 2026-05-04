# foodplease-mobile — Guía de instalación y uso

## Requisitos previos

- [Node.js](https://nodejs.org/) >= 18
- [Expo CLI](https://docs.expo.dev/get-started/installation/) >= 18.9.1
- [EAS CLI](https://docs.expo.dev/eas-update/getting-started/) (para builds)

```bash
npm install -g expo-cli
npm install -g eas-cli
```

---

## Dependencias

### Instalar todas las dependencias del proyecto

```bash
npm install
```

### Dependencias de producción

| Paquete | Versión |
|---|---|
| `@expo/vector-icons` | ^15.1.1 |
| `@react-native-async-storage/async-storage` | ^2.2.0 |
| `@react-navigation/bottom-tabs` | ^7.15.11 |
| `@react-navigation/native` | ^7.2.2 |
| `@react-navigation/native-stack` | ^7.14.12 |
| `expo` | ~54.0.33 |
| `expo-dev-client` | ~6.0.21 |
| `expo-status-bar` | ~3.0.9 |
| `react` | 19.1.0 |
| `react-dom` | 19.1.0 |
| `react-native` | 0.81.5 |
| `react-native-safe-area-context` | ~5.6.0 |
| `react-native-screens` | ~4.16.0 |
| `react-native-web` | ^0.21.0 |

### Dependencias de desarrollo

| Paquete | Versión |
|---|---|
| `@types/react` | ~19.1.0 |
| `typescript` | ~5.9.2 |

---

## Correr la app

### Modo general (Expo Go o dev client)

```bash
npm start
# o
expo start
```

### Android

```bash
npm run android
# o
expo start --android
```

### iOS

```bash
npm run ios
# o
expo start --ios
```

### Web

```bash
npm run web
# o
expo start --web
```

---

## Build con EAS

> Asegúrate de estar logueado en tu cuenta Expo antes de buildear:
> ```bash
> eas login
> ```

### Build de desarrollo (dev client, distribución interna)

```bash
eas build --profile development --platform android
eas build --profile development --platform ios
```

### Build preview (APK para Android, distribución interna)

```bash
eas build --profile preview --platform android
eas build --profile preview --platform ios
```

### Build de producción (APK para Android)

```bash
eas build --profile production --platform android
eas build --profile production --platform ios
```

### Build para ambas plataformas a la vez

```bash
eas build --profile production --platform all
```

---

## IDs del proyecto

- **Bundle ID (iOS):** `cl.marcuxo.foodpleasemobile`
- **Package (Android):** `cl.marcuxo.foodpleasemobile`
- **EAS Project ID:** `b76e7bce-ecc6-453f-90bc-d30c58ba7211`
