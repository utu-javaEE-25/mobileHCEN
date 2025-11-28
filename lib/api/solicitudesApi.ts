export const API_BASE_URL = "http://hcenuy.web.elasticloud.uy/Laboratorio";

export interface SolicitudAcceso {
    id: number;
    profesional: string;
    institucion: string;
    tipoDocumento: string;
    fechaSolicitud: string;
    estado: string;
    motivo?: string;
}

function authHeaders(sessionCookie: string): HeadersInit {
    return {
        "Content-Type": "application/json",
        Cookie: `JSESSIONID=${sessionCookie}`
    };
}

export async function listarSolicitudes(sessionCookie: string): Promise<SolicitudAcceso[]> {
    const resp = await fetch(`${API_BASE_URL}/api/mobile/solicitudes`, {
        method: "GET",
        headers: authHeaders(sessionCookie)
    });

    if (resp.status === 404) return [];
    if (!resp.ok) throw new Error("SERVER_ERROR");

    return await resp.json();
}

export async function obtenerSolicitud(sessionCookie: string, id: number): Promise<SolicitudAcceso> {
    const resp = await fetch(`${API_BASE_URL}/api/mobile/solicitudes/${id}`, {
        method: "GET",
        headers: authHeaders(sessionCookie)
    });

    if (!resp.ok) throw new Error("SERVER_ERROR");
    return await resp.json();
}

export async function aprobarSolicitud(sessionCookie: string, id: number) {
    const resp = await fetch(`${API_BASE_URL}/api/mobile/solicitudes/${id}/aprobar`, {
        method: "POST",
        headers: authHeaders(sessionCookie)
    });

    if (!resp.ok) throw new Error("SERVER_ERROR");
}

export async function rechazarSolicitud(sessionCookie: string, id: number) {
    const resp = await fetch(`${API_BASE_URL}/api/mobile/solicitudes/${id}/rechazar`, {
        method: "POST",
        headers: authHeaders(sessionCookie)
    });

    if (!resp.ok) throw new Error("SERVER_ERROR");
}
