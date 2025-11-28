// @ts-nocheck
import React, { useEffect, useState, useCallback } from "react";
import {
    View,
    Text,
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Alert,
    TouchableOpacity
} from "react-native";
import { useRouter } from "expo-router";

import { fetchHistorialAccesos } from "@/lib/api/historialAccesosApi";

export default function HistorialAccesosListado() {
    const router = useRouter();

    const [sessionCookie, setSessionCookie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [accesos, setAccesos] = useState([]);

    // Obtener cookie
    useEffect(() => {
        if (globalThis.sessionCookie) {
            setSessionCookie(globalThis.sessionCookie);
        }
    }, []);

    const cargarHistorial = useCallback(async () => {
        if (!sessionCookie) return;

        try {
            setLoading(true);
            const lista = await fetchHistorialAccesos(sessionCookie);
            setAccesos(lista);
        } catch (e) {
            if (e.message === "UNAUTHORIZED") {
                Alert.alert("Sesión vencida", "Inicia sesión nuevamente.");
            } else {
                Alert.alert("Error", "No se pudo obtener el historial de accesos.");
            }
        } finally {
            setLoading(false);
        }
    }, [sessionCookie]);

    useEffect(() => {
        cargarHistorial();
    }, [cargarHistorial]);

    const abrirDetalle = (id: number) => {
        router.push(`/historial-accesos/${id}`);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Historial de Accesos</Text>

            {loading ? (
                <ActivityIndicator size="large" style={{ marginTop: 20 }} />
            ) : accesos.length === 0 ? (
                <Text style={styles.empty}>No hay accesos registrados.</Text>
            ) : (
                <FlatList
                    data={accesos}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.card}
                            onPress={() => abrirDetalle(item.id)}
                        >
                            <Text style={styles.tipo}>{item.tipo}</Text>
                            <Text style={styles.prestador}>{item.prestador}</Text>
                            <Text style={styles.fecha}>
                                {new Date(item.fecha).toLocaleString()}
                            </Text>
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
    empty: { textAlign: "center", marginTop: 20, color: "#777" },
    card: {
        padding: 14,
        marginBottom: 12,
        backgroundColor: "#fff",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#eee"
    },
    tipo: { fontSize: 16, fontWeight: "600" },
    prestador: { fontSize: 14, color: "#444", marginBottom: 4 },
    fecha: { fontSize: 12, color: "#777" }
});
