// @ts-nocheck
import { useEffect, useRef, useState } from 'react';
import { Alert, Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';

export interface UsePushNotificationsOptions {
  /**
   * Llamado cuando el dispositivo obtiene el token FCM
   */
  onDeviceToken?: (token: string) => void;
}

export interface UsePushNotificationsResult {
  /**
   * Última notificación recibida en foreground
   */
  lastNotification: Notifications.Notification | null;
}

/**
 * Hook centralizado para:
 * - Pedir permisos de notificación.
 * - Obtener token de FCM.
 * - Escuchar notificaciones en foreground.
 * - Escuchar taps del usuario y navegar al modulo correspondiente.
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

  const router = useRouter();

  useEffect(() => {
    (async () => {
      if (!Device.isDevice) {
        console.log('[Push] Requiere dispositivo físico.');
        return;
      }

      // 1) Obtener permisos
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

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

      // 2) Obtener token FCM nativo
      const devicePushToken = await Notifications.getDevicePushTokenAsync();
      console.log('[Push] Token FCM:', devicePushToken);

      const tokenString =
        typeof devicePushToken.data === 'string'
          ? devicePushToken.data
          : JSON.stringify(devicePushToken.data);

      if (tokenString && options?.onDeviceToken) {
        options.onDeviceToken(tokenString);
      }

      // 3) Canal Android
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.DEFAULT,
        });
      }
    })();

    // 4) Listener: notificación recibida en foreground
    notificationListener.current =
      Notifications.addNotificationReceivedListener(notification => {
        console.log('[Push] Recibida (foreground):', notification);
        setLastNotification(notification);
      });

    // 5) Listener: usuario toca / abre la notificación
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(response => {
        const data = response.notification.request.content.data;
        console.log('[Push] Usuario tocó:', data);

        if (!data) return;

        /**
         * 🔵 Rutas automáticas según tipo de notificación
         * Estas rutas coinciden con:
         * - solicitudes/[id].tsx
         * - notificaciones/[id].tsx
         * - historia-clinica/[id].tsx (si venía documentId)
         */

        // Solicitud de acceso en tiempo real
        if (data.tipo === 'SOLICITUD_ACCESO' && data.solicitudId) {
          router.push(`/solicitudes/${data.solicitudId}`);
          return;
        }

        // Notificación normal enviada desde backend
        if (data.tipo === 'NOTIFICACION' && data.idNotificacion) {
          router.push(`/notificaciones/${data.idNotificacion}`);
          return;
        }

        // Documento clínico (opcional, si backend lo envía)
        if (data.tipo === 'DOCUMENTO' && data.documentoId) {
          router.push(`/historia-clinica/${data.documentoId}`);
          return;
        }

        // Fallback genérico
        if (data.route) {
          router.push(data.route);
        }
      });

    // 6) Cleanup
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
