// @ts-nocheck
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, Alert } from 'react-native';
import { useRouter } from 'expo-router';

import NotificationItem from '@/components/notification/NotificationItem';
import {
    fetchNotificaciones,
    MobileNotification
} from '@/lib/api/mobileNotificationApi';

export default function NotificacionesScreen() {
    const router = useRouter();

    const [sessionCookie, setSessionCookie] = useState<string | null>(null);
    const [notificaciones, setNotificaciones] = useState<MobileNotification[]>([]);
    const [loading, setLoading] = useState(false);

    // Obtenemos el sessionCookie guardado por index.tsx
    useEffect(() => {
        // Lo traemos desde el objeto global o desde otro lado según tu arquitectura.
        // Si lo guardaste con expo SecureStore o AsyncStorage, lo lees aquí.
        // De momento, intentamos leerlo de una variable global (si la usas).
        if (globalThis.sessionCookie) {
            setSessionCookie(globalThis.sessionCookie);
        }
    }, []);

    const cargarNotificaciones = useCallback(async () => {
        if (!sessionCookie) return;

        setLoading(true);
        try {
            const lista = await fetchNotificaciones(sessionCookie);
            setNotificaciones(lista);
        } catch (err) {
            console.log('[Notificaciones] Error:', err);
            Alert.alert('Error', 'No se pudieron cargar las notificaciones.');
        } finally {
            setLoading(false);
        }
    }, [sessionCookie]);

    useEffect(() => {
        cargarNotificaciones();
    }, [cargarNotificaciones]);

    const handlePress = (id: number) => {
        router.push(`/notificaciones/${id}`);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mis Notificaciones</Text>

            <FlatList
                data={notificaciones}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <NotificationItem
                        notification={item}
                        onPress={() => handlePress(item.id)}
                    />
                )}
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={cargarNotificaciones} />
                }
                ListEmptyComponent={() => (
                    <Text style={styles.empty}>No hay notificaciones</Text>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 26,
        paddingHorizontal: 12
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 12
    },
    empty: {
        textAlign: 'center',
        marginTop: 20,
        color: '#777'
    }
});
