// @ts-nocheck
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ScrollView
} from "react-native";
import { useRouter } from "expo-router";

import { crearPolitica } from "@/lib/api/politicasApi";

export default function NuevaPolitica() {
    const router = useRouter();

    const [sessionCookie, setSessionCookie] = useState(null);

    const [profesional, setProfesional] = useState("");
    const [institucion, setInstitucion] = useState("");
    const [nivelAcceso, setNivelAcceso] = useState("LECTURA");
    const [fechaDesde, setFechaDesde] = useState("");
    const [fechaHasta, setFechaHasta] = useState("");
    const [motivo, setMotivo] = useState("");

    useEffect(() => {
        if (globalThis.sessionCookie) {
            setSessionCookie(globalThis.sessionCookie);
        }
    }, []);

    const guardar = async () => {
        if (
            !profesional ||
            !institucion ||
            !nivelAcceso ||
            !fechaDesde ||
            !motivo
        ) {
            Alert.alert("Error", "Completa todos los campos obligatorios.");
            return;
        }

        try {
            await crearPolitica(sessionCookie, {
                profesional,
                institucion,
                nivelAcceso,
                fechaDesde,
                fechaHasta,
                motivo
            });

            Alert.alert("Éxito", "La política fue creada correctamente.");
            router.replace("/politicas");
        } catch (e) {
            Alert.alert("Error", "No se pudo crear la política.");
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Nueva Política</Text>

            <Text style={styles.label}>Profesional *</Text>
            <TextInput
                style={styles.input}
                value={profesional}
                onChangeText={setProfesional}
                placeholder="Ej: Dr. Juan Pérez"
            />

            <Text style={styles.label}>Institución *</Text>
            <TextInput
                style={styles.input}
                value={institucion}
                onChangeText={setInstitucion}
                placeholder="Ej: Hospital Central"
            />

            <Text style={styles.label}>Nivel de acceso *</Text>
            <TextInput
                style={styles.input}
                value={nivelAcceso}
                onChangeText={setNivelAcceso}
                placeholder="LECTURA, TOTAL..."
            />

            <Text style={styles.label}>Fecha desde *</Text>
            <TextInput
                style={styles.input}
                value={fechaDesde}
                onChangeText={setFechaDesde}
                placeholder="YYYY-MM-DD"
            />

            <Text style={styles.label}>Fecha hasta (opcional)</Text>
            <TextInput
                style={styles.input}
                value={fechaHasta}
                onChangeText={setFechaHasta}
                placeholder="YYYY-MM-DD"
            />

            <Text style={styles.label}>Motivo *</Text>
            <TextInput
                style={[styles.input, { height: 80 }]}
                value={motivo}
                onChangeText={setMotivo}
                multiline
            />

            <TouchableOpacity style={styles.saveButton} onPress={guardar}>
                <Text style={styles.saveButtonText}>Guardar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
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
    cancelButton: {
        padding: 14,
        marginTop: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#555"
    },
    cancelButtonText: { textAlign: "center", color: "#555", fontSize: 16 }
});
