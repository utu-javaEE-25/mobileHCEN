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

const API_BASE_URL = "http://hcenuy.web.elasticloud.uy/Laboratorio";

export default function HistoriaClinicaListado() {
    const router = useRouter();

    const [sessionCookie, setSessionCookie] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [documentos, setDocumentos] = useState([]);

    useEffect(() => {
        if (globalThis.sessionCookie) {
            setSessionCookie(globalThis.sessionCookie);
        }
    }, []);

    // 🔵 Cargar historia desde el endpoint REAL
    const cargarHistoriaClinica = useCallback(async () => {
        if (!sessionCookie) return;

        try {
            setLoading(true);

            const resp = await fetch(
                `${API_BASE_URL}/historia-clinica/mi-historia`,
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

            if (!resp.ok) {
                console.log("HC error:", resp.status);
                setDocumentos([]);
                setLoading(false);
                return;
            }

            const json = await resp.json();
            setDocumentos(json || []);

        } catch (e) {
            console.log("Error HCEN:", e);
            Alert.alert("Error", "No se pudo obtener la historia clínica.");
        } finally {
            setLoading(false);
        }
    }, [sessionCookie]);

    useEffect(() => {
        cargarHistoriaClinica();
    }, [cargarHistoriaClinica]);

    // 🔵 Cambiamos el ID → HCEN usa idExternaDoc
    const abrirDetalle = (doc) => {
        router.push({
            pathname: "/historia-clinica/[id]",
            params: {
                id: doc.idExternaDoc,
                prestador: doc.prestador,
                tipoDocumento: doc.tipoDocumento,
                fecha: doc.fechaCreacion
            }
        });
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
                    keyExtractor={(item) => item.idExternaDoc?.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.card}
                            onPress={() => abrirDetalle(item)}
                        >
                            <Text style={styles.itemTitle}>{item.tipoDocumento}</Text>
                            <Text style={styles.itemPrestador}>{item.prestador}</Text>
                            <Text style={styles.itemFecha}>
                                {new Date(item.fechaCreacion).toLocaleString()}
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
