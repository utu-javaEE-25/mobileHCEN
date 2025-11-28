/**
 * Ajustá este BASE_URL si cambiás el host o contexto.
 * Idealmente, que coincida con el usado en app/(tabs)/index.tsx
 */
export const API_BASE_URL =
    'http://hcenuy.web.elasticloud.uy/Laboratorio';

/**
 * Representa una notificación tal como la devuelve el backend.
 * Los campos son flexibles para no acoplar demasiado al modelo Java.
 */
export interface MobileNotification {
    id: number;
    titulo: string;
    cuerpo: string;
    // tipo de evento (ej: "SOLICITUD_ACCESO", "ACCESO_DOCUMENTO", etc.)
    tipo?: string;
    // fecha/hora en ISO
    fechaCreacion?: string;
    // si el usuario ya la marcó como leída
    leida: boolean;
    // payload extra genérico (debe respetar AC012: sin datos sensibles)
    datos?: Record<string, unknown>;
}

/**
 * Preferencias de notificaciones del usuario.
 * Ajustá estos campos a lo que finalmente exponga tu backend.
 */
export interface NotificationPreferences {
    // Notificar cuando haya nuevas solicitudes de acceso
    notificarSolicitudesAcceso: boolean;
    // Notificar cuando alguien accede a un documento
    notificarAccesosDocumentos: boolean;
    // Notificaciones de tipo administrativo
    notificarEventosAdministrativos: boolean;
    // Horario de silencio (si lo implementan)
    horarioSilencioDesde?: string | null; // "22:00"
    horarioSilencioHasta?: string | null; // "08:00"
}

/**
 * Payload para registrar un token de dispositivo móvil.
 */
export interface RegisterDeviceTokenPayload {
    deviceToken: string;
    plataforma: 'ANDROID' | 'IOS';
}

/**
 * Helper básico para manejar errores HTTP.
 */
class HttpError extends Error {
    status: number;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }
}

/**
 * Construye headers con cookie de sesión.
 * El backend JavaEE recibirá el JSESSIONID como si fuese un navegador.
 */
function buildAuthHeaders(sessionCookie: string): HeadersInit {
    return {
        'Content-Type': 'application/json',
        Cookie: `JSESSIONID=${sessionCookie}`,
    };
}

/**
 * Registra o actualiza el deviceToken de un dispositivo móvil para el usuario autenticado.
 * Endpoint sugerido en backend:
 *   POST /api/mobile/device-token
 */
export async function registerDeviceToken(
    sessionCookie: string,
    payload: RegisterDeviceTokenPayload
): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/mobile/device-token`, {
        method: 'POST',
        headers: buildAuthHeaders(sessionCookie),
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const text = await response.text().catch(() => '');
        console.error(
            '[API] Error al registrar device token:',
            response.status,
            text
        );
        throw new HttpError(
            response.status,
            `Error registrando token de dispositivo (${response.status})`
        );
    }
}

/**
 * Obtiene el listado de notificaciones del usuario autenticado.
 * Endpoint sugerido:
 *   GET /api/mobile/notificaciones
 */
export async function fetchNotificaciones(
    sessionCookie: string
): Promise<MobileNotification[]> {
    const response = await fetch(`${API_BASE_URL}/api/mobile/notificaciones`, {
        method: 'GET',
        headers: buildAuthHeaders(sessionCookie),
    });

    if (!response.ok) {
        const text = await response.text().catch(() => '');
        console.error(
            '[API] Error al obtener notificaciones:',
            response.status,
            text
        );
        throw new HttpError(
            response.status,
            `Error obteniendo notificaciones (${response.status})`
        );
    }

    const json = (await response.json().catch(() => [])) as MobileNotification[];
    return json;
}

/**
 * Marca una notificación como leída.
 * Endpoint sugerido:
 *   POST /api/mobile/notificaciones/{id}/leida
 */
export async function markNotificacionLeida(
    sessionCookie: string,
    id: number
): Promise<void> {
    const response = await fetch(
        `${API_BASE_URL}/api/mobile/notificaciones/${id}/leida`,
        {
            method: 'POST',
            headers: buildAuthHeaders(sessionCookie),
        }
    );

    if (!response.ok) {
        const text = await response.text().catch(() => '');
        console.error(
            '[API] Error al marcar notificación como leída:',
            response.status,
            text
        );
        throw new HttpError(
            response.status,
            `Error marcando notificación como leída (${response.status})`
        );
    }
}

/**
 * Obtiene las preferencias de notificaciones del usuario.
 * Endpoint sugerido:
 *   GET /api/mobile/preferencias
 */
export async function fetchNotificationPreferences(
    sessionCookie: string
): Promise<NotificationPreferences> {
    const response = await fetch(`${API_BASE_URL}/api/mobile/preferencias`, {
        method: 'GET',
        headers: buildAuthHeaders(sessionCookie),
    });

    if (!response.ok) {
        const text = await response.text().catch(() => '');
        console.error(
            '[API] Error al obtener preferencias de notificaciones:',
            response.status,
            text
        );
        throw new HttpError(
            response.status,
            `Error obteniendo preferencias de notificaciones (${response.status})`
        );
    }

    const json = (await response.json()) as NotificationPreferences;
    return json;
}

/**
 * Actualiza las preferencias de notificaciones del usuario.
 * Endpoint sugerido:
 *   POST /api/mobile/preferencias
 */
export async function updateNotificationPreferences(
    sessionCookie: string,
    preferences: NotificationPreferences
): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/mobile/preferencias`, {
        method: 'POST',
        headers: buildAuthHeaders(sessionCookie),
        body: JSON.stringify(preferences),
    });

    if (!response.ok) {
        const text = await response.text().catch(() => '');
        console.error(
            '[API] Error al actualizar preferencias de notificaciones:',
            response.status,
            text
        );
        throw new HttpError(
            response.status,
            `Error actualizando preferencias de notificaciones (${response.status})`
        );
    }
}
