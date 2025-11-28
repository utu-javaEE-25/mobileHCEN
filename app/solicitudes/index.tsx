// @ts-nocheck
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    Alert
} from "react-native";
import { useRouter } from "expo-router";

import { listarSolicitudes } from "@/lib/api/solicitudesApi";

export default function SolicitudesListado() {
    const router = useRouter();
    const [sessionCookie, setSessionCookie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [solicitudes, setSolicitudes] = useState([]);

    useEffect(() => {
        if (globalThis.sessionCookie) {
            setSessionCookie(globalThis.sessionCookie);
        }
    }, []);

    const cargar = async () => {
        try {
            const lista = await listarSolicitudes(sessionCookie);
            setSolicitudes(lista);
        } catch {
            Alert.alert("Error", "No se pudieron cargar las solicitudes.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (sessionCookie) cargar();
    }, [sessionCookie]);

    const abrirDetalle = (id: number) => {
        router.push(`/solicitudes/${id}`);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Solicitudes de Acceso</Text>

            {loading ? (
                <ActivityIndicator size="large" />
            ) : solicitudes.length === 0 ? (
                <Text style={styles.empty}>No hay solicitudes pendientes.</Text>
            ) : (
                <FlatList
                    data={solicitudes}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.card}
                            onPress={() => abrirDetalle(item.id)}
                        >
                            <Text style={styles.cardTitle}>{item.profesional}</Text>
                            <Text style={styles.cardSub}>{item.institucion}</Text>
                            <Text style={styles.cardDate}>{new Date(item.fechaSolicitud).toLocaleString()}</Text>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 26 },
    title: { fontSize: 22, fontWeight: "700", marginBottom: 16 },
    empty: { marginTop: 20, textAlign: "center", color: "#777" },
    card: {
        backgroundColor: "#fff",
        padding: 14,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#eee",
        marginBottom: 12
    },
    cardTitle: { fontSize: 16, fontWeight: "600" },
    cardSub: { fontSize: 14, color: "#555" },
    cardDate: { fontSize: 12, color: "#777", marginTop: 6 }
});
