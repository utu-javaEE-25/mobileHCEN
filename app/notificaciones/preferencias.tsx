// @ts-nocheck
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';

import NotificationPreferencesForm from '@/components/notification/NotificationPreferencesForm';
import {
    fetchNotificationPreferences,
    updateNotificationPreferences,
    NotificationPreferences
} from '@/lib/api/mobileNotificationApi';

export default function PreferenciasNotificacionesScreen() {
    const [sessionCookie, setSessionCookie] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);

    // Obtener JSESSIONID almacenado previamente
    useEffect(() => {
        if (globalThis.sessionCookie) {
            setSessionCookie(globalThis.sessionCookie);
        }
    }, []);

    // Cargar preferencias desde el backend
    const cargarPreferencias = useCallback(async () => {
        if (!sessionCookie) return;

        try {
            setLoading(true);
            const prefs = await fetchNotificationPreferences(sessionCookie);
            setPreferences(prefs);
        } catch (error) {
            console.log('[Preferencias] Error:', error);
            Alert.alert('Error', 'No se pudieron cargar las preferencias de notificaciones.');
        } finally {
            setLoading(false);
        }
    }, [sessionCookie]);

    useEffect(() => {
        cargarPreferencias();
    }, [cargarPreferencias]);

    const handleSubmit = async (prefs: NotificationPreferences) => {
        if (!sessionCookie) return;

        try {
            await updateNotificationPreferences(sessionCookie, prefs);
            Alert.alert('OK', 'Preferencias actualizadas correctamente.');
            setPreferences(prefs);
        } catch (error) {
            console.log('[Preferencias] Error al actualizar:', error);
            Alert.alert('Error', 'No se pudieron guardar las preferencias.');
        }
    };

    if (loading || !preferences) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
                <Text>Cargando preferencias...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <NotificationPreferencesForm
                initialPreferences={preferences}
                onSubmit={handleSubmit}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
