// @ts-nocheck
import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function HistoriaClinicaDetalle() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Detalle de Documento</Text>

            <Text style={styles.subtitle}>
                ID del documento: {id}
            </Text>

            <Text style={styles.info}>
                El backend aún no implementó el endpoint de detalle.
            </Text>

            <Text style={styles.info}>
                Una vez esté disponible, esta pantalla mostrará toda la información del
                documento seleccionado.
            </Text>

            <Button title="Volver" onPress={() => router.back()} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 26 },
    title: { fontSize: 22, fontWeight: "700", marginBottom: 16 },
    subtitle: { fontSize: 16, marginBottom: 12 },
    info: { fontSize: 14, marginBottom: 12, color: "#555" }
});
