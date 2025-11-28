import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { MobileNotification } from '@/lib/api/mobileNotificationApi';

interface Props {
    notification: MobileNotification;
    onPress?: () => void;
}

export default function NotificationItem({ notification, onPress }: Props) {
    const { titulo, cuerpo, fechaCreacion, leida } = notification;

    const formattedDate = fechaCreacion
        ? new Date(fechaCreacion).toLocaleString()
        : '';

    return (
        <TouchableOpacity onPress={onPress} style={styles.container}>
            <View style={styles.row}>
                {!leida && <View style={styles.unreadDot} />}
                <Text style={[styles.title, leida && styles.leida]} numberOfLines={1}>
                    {titulo}
                </Text>
            </View>

            <Text style={[styles.body, leida && styles.leida]} numberOfLines={2}>
                {cuerpo}
            </Text>

            {fechaCreacion && (
                <Text style={styles.date}>{formattedDate}</Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        backgroundColor: '#fff'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4
    },
    unreadDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#007AFF',
        marginRight: 8
    },
    title: {
        fontSize: 16,
        fontWeight: '600'
    },
    body: {
        fontSize: 14,
        color: '#444',
        marginTop: 2
    },
    date: {
        marginTop: 6,
        fontSize: 12,
        color: '#888'
    },
    leida: {
        opacity: 0.5
    }
});
