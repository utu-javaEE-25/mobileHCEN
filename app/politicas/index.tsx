// @ts-nocheck
import React, { useEffect, useState, useCallback } from "react";
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    Alert,
    StyleSheet
} from "react-native";
import { useRouter } from "expo-router";

import { fetchPoliticas } from "@/lib/api/politicasApi";

export default function PoliticasListado() {
    const router = useRouter();

    const [sessionCookie, setSessionCookie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [politicas, setPoliticas] = useState([]);

    useEffect(() => {
        if (globalThis.sessionCookie) {
            setSessionCookie(globalThis.sessionCookie);
        }
    }, []);

    const cargarPoliticas = useCallback(async () => {
        if (!sessionCookie) return;

        try {
            setLoading(true);
            const lista = await fetchPoliticas(sessionCookie);
            setPoliticas(lista);
        } catch (e) {
            Alert.alert("Error", "No se pudieron obtener las políticas.");
        } finally {
            setLoading(false);
        }
    }, [sessionCookie]);

    useEffect(() => {
        cargarPoliticas();
    }, [cargarPoliticas]);

    const abrirDetalle = (id: number) => {
        router.push(`/politicas/${id}`);
    };

    const crearNueva = () => {
        router.push(`/politicas/nueva`);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Políticas de Acceso</Text>

            {loading ? (
                <ActivityIndicator size="large" />
            ) : (
                <>
                    <TouchableOpacity style={styles.newButton} onPress={crearNueva}>
                        <Text style={styles.newButtonText}>Crear nueva política</Text>
                    </TouchableOpacity>

                    {politicas.length === 0 ? (
                        <Text style={styles.empty}>No hay políticas configuradas.</Text>
                    ) : (
                        <FlatList
                            data={politicas}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={styles.card} onPress={() => abrirDetalle(item.id)}>
                                    <Text style={styles.cardTitle}>{item.profesional}</Text>
                                    <Text style={styles.cardSubtitle}>{item.institucion}</Text>
                                    <Text style={styles.cardStatus}>{item.estado}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    )}
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 26 },
    title: { fontSize: 22, fontWeight: "700", marginBottom: 16 },
    empty: { marginTop: 20, textAlign: "center", color: "#777" },
    newButton: {
        padding: 12,
        backgroundColor: "#007AFF",
        borderRadius: 8,
        marginBottom: 16
    },
    newButtonText: { color: "#fff", textAlign: "center", fontSize: 16 },
    card: {
        padding: 14,
        borderRadius: 8,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#eee",
        marginBottom: 12
    },
    cardTitle: { fontSize: 16, fontWeight: "600" },
    cardSubtitle: { fontSize: 14, color: "#444" },
    cardStatus: { fontSize: 12, color: "#777", marginTop: 4 }
});
