// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, Button } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import {
    fetchNotificaciones,
    markNotificacionLeida,
    MobileNotification
} from '@/lib/api/mobileNotificationApi';

export default function NotificacionDetalleScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { id } = params; // viene como string

    const [sessionCookie, setSessionCookie] = useState<string | null>(null);
    const [notificacion, setNotificacion] = useState<MobileNotification | null>(null);

    useEffect(() => {
        if (globalThis.sessionCookie) {
            setSessionCookie(globalThis.sessionCookie);
        }
    }, []);

    const cargarNotificacion = async () => {
        if (!sessionCookie) return;
        try {
            const lista = await fetchNotificaciones(sessionCookie);
            const encontrada = lista.find(n => n.id === Number(id));
            if (!encontrada) {
                Alert.alert('Error', 'Notificación no encontrada.');
                return;
            }
            setNotificacion(encontrada);
        } catch (err) {
            console.log('[Detalle Notif] Error:', err);
            Alert.alert('Error', 'No se pudo cargar la notificación.');
        }
    };

    const marcarLeida = async () => {
        if (!sessionCookie) return;
        try {
            await markNotificacionLeida(sessionCookie, Number(id));
            Alert.alert('OK', 'Notificación marcada como leída.');
            cargarNotificacion();
        } catch (err) {
            console.log('[Detalle Notif] Error al marcar leída:', err);
            Alert.alert('Error', 'No se pudo marcar la notificación.');
        }
    };

    useEffect(() => {
        cargarNotificacion();
    }, [sessionCookie, id]);

    if (!notificacion) {
        return (
            <View style={styles.container}>
                <Text style={styles.loading}>Cargando…</Text>
            </View>
        );
    }

    const { titulo, cuerpo, fechaCreacion, tipo, datos, leida } = notificacion;
    const formattedDate = fechaCreacion
        ? new Date(fechaCreacion).toLocaleString()
        : '';

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>{titulo}</Text>

            <Text style={styles.subtitle}>
                Fecha: {formattedDate}
            </Text>

            <Text style={styles.subtitle}>
                Estado: {leida ? 'Leída' : 'No leída'}
            </Text>

            {tipo && (
                <Text style={styles.subtitle}>
                    Tipo: {tipo}
                </Text>
            )}

            <View style={styles.box}>
                <Text style={styles.body}>{cuerpo}</Text>
            </View>

            {/* Datos extra (deben ser NO sensibles, según AC012) */}
            {datos && (
                <View style={styles.extraBox}>
                    <Text style={styles.subtitle}>Datos adicionales:</Text>
                    <Text style={styles.extraText}>
                        {JSON.stringify(datos, null, 2)}
                    </Text>
                </View>
            )}

            {!leida && (
                <Button title="Marcar como leída" onPress={marcarLeida} />
            )}

            <View style={{ marginTop: 16 }}>
                <Button title="Volver" onPress={() => router.back()} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16
    },
    loading: {
        marginTop: 40,
        textAlign: 'center'
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 10
    },
    subtitle: {
        fontSize: 14,
        marginBottom: 5,
        color: '#555'
    },
    box: {
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        padding: 14,
        marginVertical: 14
    },
    body: {
        fontSize: 16
    },
    extraBox: {
        marginBottom: 14
    },
    extraText: {
        fontFamily: 'monospace',
        fontSize: 14,
        color: '#333'
    }
});
