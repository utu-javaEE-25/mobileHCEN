// @ts-nocheck
import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function HistorialAccesoDetalle() {
    const router = useRouter();
    const { id } = useLocalSearchParams();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Detalle de Acceso</Text>

            <Text style={styles.info}>
                ID del acceso: {id}
            </Text>

            <Text style={styles.info}>
                El backend aún no provee un endpoint de detalle.
            </Text>

            <Button title="Volver" onPress={() => router.back()} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 26 },
    title: { fontSize: 22, fontWeight: "700", marginBottom: 16 },
    info: { fontSize: 14, marginBottom: 12 }
});
