// @ts-nocheck
import React, { useEffect, useState, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    Alert,
    TouchableOpacity
} from "react-native";
import { useRouter } from "expo-router";

// Ajustá si tu API_BASE_URL está en otro archivo
const API_BASE_URL = "http://hcenuy.web.elasticloud.uy/Laboratorio";

export default function HistoriaClinicaListado() {
    const router = useRouter();

    const [sessionCookie, setSessionCookie] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [documentos, setDocumentos] = useState([]);

    // 1. Obtener sesión desde globalThis (tu app ya lo hace así)
    useEffect(() => {
        if (globalThis.sessionCookie) {
            setSessionCookie(globalThis.sessionCookie);
        }
    }, []);

    // 2. Llamar al endpoint real de backend
    const cargarHistoriaClinica = useCallback(async () => {
        if (!sessionCookie) return;

        try {
            setLoading(true);

            const resp = await fetch(
                `${API_BASE_URL}/api/historia-clinica/mi-historia`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Cookie: `JSESSIONID=${sessionCookie}`
                    }
                }
            );

            if (resp.status === 401) {
                Alert.alert("Sesión expirada", "Debes iniciar sesión nuevamente.");
                return;
            }

            if (resp.status === 404) {
                setDocumentos([]);
                setLoading(false);
                return;
            }

            if (!resp.ok) {
                const text = await resp.text().catch(() => "");
                console.log("Error backend:", resp.status, text);
                Alert.alert("Error", "No se pudo obtener la historia clínica.");
                setLoading(false);
                return;
            }

            const json = await resp.json();
            setDocumentos(json);

        } catch (e) {
            console.log("Error fetch HC:", e);
            Alert.alert("Error", "Error de conexión con el servidor.");
        } finally {
            setLoading(false);
        }
    }, [sessionCookie]);

    useEffect(() => {
        cargarHistoriaClinica();
    }, [cargarHistoriaClinica]);

    const abrirDetalle = (id: string) => {
        router.push(`/historia-clinica/${id}`);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mi Historia Clínica</Text>

            {loading ? (
                <ActivityIndicator size="large" style={{ marginTop: 30 }} />
            ) : documentos.length === 0 ? (
                <Text style={styles.empty}>
                    No hay documentos disponibles para esta historia clínica.
                </Text>
            ) : (
                <FlatList
                    data={documentos}
                    keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.card}
                            onPress={() => abrirDetalle(item.id)}
                        >
                            <Text style={styles.itemTitle}>{item.tipo || "Documento"}</Text>
                            <Text style={styles.itemPrestador}>{item.prestador}</Text>
                            <Text style={styles.itemFecha}>
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
        borderRadius: 8,
        backgroundColor: "#fff",
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#eee"
    },
    itemTitle: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
    itemPrestador: { fontSize: 14, color: "#444", marginBottom: 4 },
    itemFecha: { fontSize: 12, color: "#777" }
});
