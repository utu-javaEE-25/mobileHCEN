// @ts-nocheck
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    ScrollView
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import {
    fetchPoliticas,
    actualizarPolitica,
    eliminarPolitica
} from "@/lib/api/politicasApi";

export default function PoliticaDetalle() {
    const router = useRouter();
    const { id } = useLocalSearchParams();

    const [sessionCookie, setSessionCookie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [politica, setPolitica] = useState(null);

    // Form fields
    const [profesional, setProfesional] = useState("");
    const [institucion, setInstitucion] = useState("");
    const [nivelAcceso, setNivelAcceso] = useState("");
    const [fechaDesde, setFechaDesde] = useState("");
    const [fechaHasta, setFechaHasta] = useState("");
    const [motivo, setMotivo] = useState("");

    useEffect(() => {
        if (globalThis.sessionCookie) {
            setSessionCookie(globalThis.sessionCookie);
        }
    }, []);

    const cargar = async () => {
        try {
            const lista = await fetchPoliticas(sessionCookie);
            const encontrada = lista.find((p) => p.id == id);

            if (!encontrada) {
                Alert.alert("Error", "La política no existe.");
                router.back();
                return;
            }

            setPolitica(encontrada);

            // Set form values
            setProfesional(encontrada.profesional);
            setInstitucion(encontrada.institucion);
            setNivelAcceso(encontrada.nivelAcceso);
            setFechaDesde(encontrada.fechaDesde);
            setFechaHasta(encontrada.fechaHasta || "");
            setMotivo(encontrada.motivo);

        } catch (e) {
            Alert.alert("Error", "No se pudo cargar la política.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (sessionCookie) cargar();
    }, [sessionCookie]);

    const guardarCambios = async () => {
        try {
            await actualizarPolitica(sessionCookie, id, {
                profesional,
                institucion,
                nivelAcceso,
                fechaDesde,
                fechaHasta,
                motivo
            });

            Alert.alert("Éxito", "La política fue actualizada.");
            router.replace("/politicas");
        } catch (e) {
            Alert.alert("Error", "No se pudo actualizar la política.");
        }
    };

    const eliminar = async () => {
        Alert.alert(
            "Confirmar",
            "¿Deseas eliminar esta política?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await eliminarPolitica(sessionCookie, id);
                            Alert.alert("Eliminada", "La política ha sido eliminada.");
                            router.replace("/politicas");
                        } catch (e) {
                            Alert.alert("Error", "No se pudo eliminar la política.");
                        }
                    }
                }
            ]
        );
    };

    if (loading) {
        return <ActivityIndicator size="large" style={{ marginTop: 30 }} />;
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Editar Política</Text>

            <Text style={styles.label}>Profesional *</Text>
            <TextInput
                style={styles.input}
                value={profesional}
                onChangeText={setProfesional}
            />

            <Text style={styles.label}>Institución *</Text>
            <TextInput
                style={styles.input}
                value={institucion}
                onChangeText={setInstitucion}
            />

            <Text style={styles.label}>Nivel de acceso *</Text>
            <TextInput
                style={styles.input}
                value={nivelAcceso}
                onChangeText={setNivelAcceso}
            />

            <Text style={styles.label}>Fecha desde *</Text>
            <TextInput
                style={styles.input}
                value={fechaDesde}
                onChangeText={setFechaDesde}
            />

            <Text style={styles.label}>Fecha hasta</Text>
            <TextInput
                style={styles.input}
                value={fechaHasta}
                onChangeText={setFechaHasta}
            />

            <Text style={styles.label}>Motivo *</Text>
            <TextInput
                style={[styles.input, { height: 80 }]}
                value={motivo}
                onChangeText={setMotivo}
                multiline
            />

            <TouchableOpacity style={styles.saveButton} onPress={guardarCambios}>
                <Text style={styles.saveButtonText}>Guardar cambios</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.deleteButton} onPress={eliminar}>
                <Text style={styles.deleteButtonText}>Eliminar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
                <Text style={styles.cancelButtonText}>Volver</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 16, paddingTop: 26 },
    title: { fontSize: 22, fontWeight: "700", marginBottom: 20 },
    label: { fontSize: 14, marginBottom: 4, fontWeight: "500" },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        padding: 10,
        borderRadius: 8,
        marginBottom: 14,
        backgroundColor: "#fff"
    },
    saveButton: {
        backgroundColor: "#007AFF",
        padding: 14,
        borderRadius: 8,
        marginTop: 10
    },
    saveButtonText: { color: "#fff", fontSize: 16, textAlign: "center" },
    deleteButton: {
        backgroundColor: "#FF3B30",
        padding: 14,
        borderRadius: 8,
        marginTop: 10
    },
    deleteButtonText: { color: "#fff", fontSize: 16, textAlign: "center" },
    cancelButton: {
        padding: 14,
        marginTop: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#555"
    },
    cancelButtonText: { textAlign: "center", color: "#555", fontSize: 16 }
});
