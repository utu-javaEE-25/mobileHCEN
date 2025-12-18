import { useEffect, useRef, useState } from 'react';
import { Alert, Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

export interface UsePushNotificationsOptions {
  /**
   * Callback para enviar el token del dispositivo al backend
   * (por ejemplo, via mobileNotificationApi.registerDeviceToken()).
   */
  onDeviceToken?: (token: string) => void;
}

export interface UsePushNotificationsResult {
  /**
   * Última notificación recibida en foreground durante esta sesión.
   * Útil para debug o mostrar algo en la pantalla actual.
   */
  lastNotification: Notifications.Notification | null;
}

/**
 * Hook centralizado para:
 * - Pedir permisos de notificación.
 * - Obtener el token nativo de push (FCM en Android, APNs en iOS).
 * - Escuchar notificaciones en foreground.
 * - Escuchar cuando el usuario toca la notificación.
 */
export function usePushNotifications(
  options?: UsePushNotificationsOptions
): UsePushNotificationsResult {
  const [lastNotification, setLastNotification] =
    useState<Notifications.Notification | null>(null);

  const notificationListener =
    useRef<Notifications.EventSubscription | null>(null);
  const responseListener =
    useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    (async () => {
      if (!Device.isDevice) {
        console.log(
          '[Push] Las notificaciones push requieren un dispositivo físico.'
        );
        return;
      }

      // 1. Verificar permisos actuales
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      // 2. Pedir permisos si no están concedidos
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        Alert.alert(
          'Permiso requerido',
          'No se otorgaron permisos de notificación al sistema operativo.'
        );
        return;
      }

      // 3. Obtener token nativo de push (el que usará FCM/APNs)
      const devicePushToken = await Notifications.getDevicePushTokenAsync();
      console.log('[Push] Device push token bruto:', devicePushToken);

      const tokenString =
        typeof devicePushToken.data === 'string'
          ? devicePushToken.data
          : JSON.stringify(devicePushToken.data);

      if (tokenString && options?.onDeviceToken) {
        options.onDeviceToken(tokenString);
      }

      // 4. Configurar canal de notificaciones en Android
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.DEFAULT,
        });
      }
    })();

    // 5. Listener: notificación recibida en foreground
    notificationListener.current =
      Notifications.addNotificationReceivedListener(notification => {
        console.log('[Push] Notificación recibida (foreground):', notification);
        setLastNotification(notification);
      });

    // 6. Listener: el usuario interactúa con una notificación (tocar/abrir)
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(response => {
        console.log('[Push] Usuario tocó la notificación:', response);
        // TIP:
        // Acá podrías leer response.notification.request.content.data
        // y navegar con expo-router (ej: hacia /notificaciones/[id])
      });

    // 7. Cleanup
    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  return { lastNotification };
}
