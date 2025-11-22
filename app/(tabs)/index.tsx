// @ts-nocheck
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function Index() {
  const urlReal = Linking.createURL("auth/success");
  
  useEffect(() => {
     // Esto mostrará una alerta en la pantalla del celular con la URL correcta
     Alert.alert("COPIA ESTA URL", urlReal);
     console.log("URL PARA JAVA:", urlReal); 
  }, []);
  const [sessionCookie, setSessionCookie] = useState(null);
  const [userData, setUserData] = useState(null);

  // IMPORTANTE: 10.0.2.2 es el localhost de tu PC desde el emulador Android
  const BASE_URL = 'http://hcenuy.web.elasticloud.uy/Laboratorio';

  useEffect(() => {
    const handleDeepLink = (event) => {
      if (!event.url) return;
      try {
        let data = Linking.parse(event.url);
        if (data.queryParams && data.queryParams.jsessionid) {
          setSessionCookie(data.queryParams.jsessionid);
          Alert.alert("¡Login Exitoso!", "Sesión guardada.");
        }
      } catch (e) {
        console.log("Error parseando link", e);
      }
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);
    return () => subscription.remove();
  }, []);

  const handleLogin = async () => {
    try {
      const loginUrl = `${BASE_URL}/login?type=user&mobile=true`;
      await WebBrowser.openBrowserAsync(loginUrl);
    } catch (e) {
      Alert.alert("Error", "No se pudo abrir el navegador");
    }
  };

  const fetchHistoriaClinica = async () => {
    if (!sessionCookie) {
      Alert.alert("Error", "Primero debes iniciar sesión");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/historia-clinica/mi-historia`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `JSESSIONID=${sessionCookie}`
        }
      });

      if (response.status === 200) {
        const json = await response.json();
        setUserData(json);
      } else {
        Alert.alert("Error", `Código del servidor: ${response.status}`);
      }
    } catch (error) {
      Alert.alert("Error de Conexión", "Asegúrate de ejecutar: adb reverse tcp:8080 tcp:8080");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>App Móvil HCEN</Text>
      
      {!sessionCookie ? (
        <View style={styles.centerContent}>
           <Text style={styles.status}>Estado: Desconectado</Text>
           <Button title="Iniciar Sesión con GUB.UY" onPress={handleLogin} />
        </View>
      ) : (
        <ScrollView style={styles.scrollContainer}>
          <Text style={styles.status}>Estado: Conectado</Text>
          <View style={{marginVertical: 10}}>
            <Button title="Ver Mi Historia Clínica" onPress={fetchHistoriaClinica} color="green" />
          </View>
          
          {userData && (
            <View style={styles.resultBox}>
              <Text style={{fontWeight:'bold'}}>Respuesta del Servidor:</Text>
              <Text style={styles.jsonText}>{JSON.stringify(userData, null, 2)}</Text>
            </View>
          )}
          
          <View style={{marginTop: 30}}>
             <Button title="Cerrar Sesión Local" onPress={() => {setSessionCookie(null); setUserData(null);}} color="red"/>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 60, paddingHorizontal: 20 },
  centerContent: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  scrollContainer: { width: '100%' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, color: '#0d6efd', textAlign: 'center' },
  status: { fontSize: 18, marginBottom: 20, textAlign: 'center' },
  resultBox: { marginTop: 20, padding: 10, backgroundColor: '#f0f0f0', borderRadius: 5 },
  jsonText: { fontFamily: 'monospace', fontSize: 12 }
});
