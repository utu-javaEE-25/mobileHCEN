// @ts-nocheck
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Button, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

const API_BASE_URL = "http://hcenuy.web.elasticloud.uy/Laboratorio";

export default function HistoriaClinicaDetalle() {
    const { id, prestador, tipoDocumento, fecha } = useLocalSearchParams();
    const router = useRouter();

    const [sessionCookie, setSessionCookie] = useState(null);
    const [contenido, setContenido] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (globalThis.sessionCookie) setSessionCookie(globalThis.sessionCookie);
    }, []);

    const cargarDocumento = async () => {
        try {
            setLoading(true);

            const cedulaPaciente = globalThis.user?.cedula;
            if (!cedulaPaciente) {
                Alert.alert("Error", "No se encontró la cédula del usuario.");
                return;
            }

            const params = new URLSearchParams({
                docId: id,
                cedulaPaciente,
                schemaSolicitante: "Laboratorio",
                idProfesional: "0"
            });

            const resp = await fetch(
                `${API_BASE_URL}/historia-clinica/documento-externo?${params.toString()}`,
                {
                    method: "GET",
                    headers: {
                        Cookie: `JSESSIONID=${sessionCookie}`
                    }
                }
            );

            if (!resp.ok) {
                Alert.alert("Error", "No se pudo cargar el documento clínico.");
                return;
            }

            const json = await resp.json();
            setContenido(json);

        } catch (e) {
            console.log("Error documento externo:", e);
            Alert.alert("Error", "No se pudo obtener el documento.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (sessionCookie) cargarDocumento();
    }, [sessionCookie]);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Detalle del Documento</Text>

            <Text style={styles.subtitle}>Tipo: {tipoDocumento}</Text>
            <Text style={styles.subtitle}>Prestador: {prestador}</Text>
            <Text style={styles.subtitle}>
                Fecha: {new Date(fecha).toLocaleString()}
            </Text>

            {loading ? (
                <ActivityIndicator size="large" style={{ marginTop: 20 }} />
            ) : contenido ? (
                <>
                    <Text style={styles.section}>Contenido del documento:</Text>
                    <Text style={styles.data}>{JSON.stringify(contenido, null, 2)}</Text>
                </>
            ) : (
                <Text style={styles.error}>Sin contenido disponible.</Text>
            )}

            <Button title="Volver" onPress={() => router.back()} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 16 },
    title: { fontSize: 22, fontWeight: "700", marginBottom: 16 },
    subtitle: { fontSize: 16, marginBottom: 6 },
    section: { fontSize: 18, fontWeight: "600", marginTop: 16, marginBottom: 8 },
    data: { fontSize: 14, color: "#333" },
    error: { color: "red", marginTop: 20 }
});
