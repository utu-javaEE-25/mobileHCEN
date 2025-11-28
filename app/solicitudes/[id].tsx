// @ts-nocheck
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    Alert
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

import {
    obtenerSolicitud,
    aprobarSolicitud,
    rechazarSolicitud
} from "@/lib/api/solicitudesApi";

export default function SolicitudDetalle() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const [sessionCookie, setSessionCookie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [solicitud, setSolicitud] = useState(null);

    useEffect(() => {
        if (globalThis.sessionCookie) setSessionCookie(globalThis.sessionCookie);
    }, []);

    useEffect(() => {
        if (!sessionCookie) return;
        cargar();
    }, [sessionCookie]);

    const cargar = async () => {
        try {
            const data = await obtenerSolicitud(sessionCookie, id);
            setSolicitud(data);
        } catch {
            Alert.alert("Error", "No se pudo cargar la solicitud.");
        } finally {
            setLoading(false);
        }
    };

    const aprobar = async () => {
        try {
            await aprobarSolicitud(sessionCookie, id);
            Alert.alert("Aprobada", "El acceso fue aprobado.");
            router.replace("/solicitudes");
        } catch {
            Alert.alert("Error", "No se pudo aprobar la solicitud.");
        }
    };

    const rechazar = async () => {
        try {
            await rechazarSolicitud(sessionCookie, id);
            Alert.alert("Rechazada", "El acceso fue rechazado.");
            router.replace("/solicitudes");
        } catch {
            Alert.alert("Error", "No se pudo rechazar la solicitud.");
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" style={{ marginTop: 30 }} />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Solicitud de Acceso</Text>
            <Text style={styles.label}>Profesional:</Text>
            <Text style={styles.value}>{solicitud?.profesional}</Text>

            <Text style={styles.label}>Institución:</Text>
            <Text style={styles.value}>{solicitud?.institucion}</Text>

            <Text style={styles.label}>Tipo de documento:</Text>
            <Text style={styles.value}>{solicitud?.tipoDocumento}</Text>

            <Text style={styles.label}>Motivo:</Text>
            <Text style={styles.value}>{solicitud?.motivo}</Text>

            <TouchableOpacity style={styles.btnSuccess} onPress={aprobar}>
                <Text style={styles.btnText}>Aprobar acceso</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnDanger} onPress={rechazar}>
                <Text style={styles.btnText}>Rechazar acceso</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnCancel} onPress={() => router.back()}>
                <Text style={styles.btnCancelText}>Volver</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 16 },
    title: { fontSize: 22, fontWeight: "700", marginBottom: 20 },
    label: { fontSize: 14, color: "#555", marginTop: 12 },
    value: { fontSize: 16, fontWeight: "600" },
    btnSuccess: {
        backgroundColor: "#0A7D0A",
        padding: 14,
        borderRadius: 8,
        marginTop: 20
    },
    btnDanger: {
        backgroundColor: "#D60000",
        padding: 14,
        borderRadius: 8,
        marginTop: 10
    },
    btnText: { color: "#fff", textAlign: "center", fontSize: 16 },
    btnCancel: {
        padding: 14,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#555",
        marginTop: 14
    },
    btnCancelText: { textAlign: "center", color: "#555", fontSize: 16 }
});
