import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, Button } from 'react-native';
import { NotificationPreferences } from '@/lib/api/mobileNotificationApi';

interface Props {
    initialPreferences: NotificationPreferences;
    onSubmit: (prefs: NotificationPreferences) => void;
}

export default function NotificationPreferencesForm({
    initialPreferences,
    onSubmit
}: Props) {
    const [prefs, setPrefs] = useState<NotificationPreferences>(
        initialPreferences
    );

    const handleToggle = (key: keyof NotificationPreferences) => {
        setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = () => {
        onSubmit(prefs);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Preferencias de Notificaciones</Text>

            <View style={styles.row}>
                <Text style={styles.label}>Solicitudes de Acceso</Text>
                <Switch
                    value={prefs.notificarSolicitudesAcceso}
                    onValueChange={() =>
                        handleToggle('notificarSolicitudesAcceso')
                    }
                />
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Accesos a Documentos</Text>
                <Switch
                    value={prefs.notificarAccesosDocumentos}
                    onValueChange={() =>
                        handleToggle('notificarAccesosDocumentos')
                    }
                />
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Eventos Administrativos</Text>
                <Switch
                    value={prefs.notificarEventosAdministrativos}
                    onValueChange={() =>
                        handleToggle('notificarEventosAdministrativos')
                    }
                />
            </View>

            {/* Si querés implementar horario de silencio */}
            {/* 
      <Text style={styles.sectionTitle}>Horario de silencio</Text>
      <View style={styles.subRow}>
        <Text>Desde: {prefs.horarioSilencioDesde || '—'}</Text>
      </View>
      */}

            <Button title="Guardar" onPress={handleSave} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 16
    },
    label: {
        fontSize: 16
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
        alignItems: 'center'
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 20,
        marginBottom: 12
    },
    subRow: {
        marginBottom: 8
    }
});
