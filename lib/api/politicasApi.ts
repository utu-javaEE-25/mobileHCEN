// lib/api/politicasApi.ts
export const API_BASE_URL = "http://hcenuy.web.elasticloud.uy/Laboratorio";

export interface PoliticaAcceso {
    id?: number;
    profesional: string;
    institucion: string;
    nivelAcceso: string;
    fechaDesde: string;
    fechaHasta: string;
    motivo: string;
    estado?: string;
}

function authHeaders(sessionCookie: string): HeadersInit {
    return {
        "Content-Type": "application/json",
        Cookie: `JSESSIONID=${sessionCookie}`
    };
}

export async function fetchPoliticas(sessionCookie: string): Promise<PoliticaAcceso[]> {
    const resp = await fetch(`${API_BASE_URL}/api/mobile/politicas`, {
        method: "GET",
        headers: authHeaders(sessionCookie)
    });

    if (resp.status === 404) return [];
    if (!resp.ok) throw new Error("SERVER_ERROR");

    return await resp.json();
}

export async function crearPolitica(
    sessionCookie: string,
    data: PoliticaAcceso
): Promise<void> {
    const resp = await fetch(`${API_BASE_URL}/api/mobile/politicas`, {
        method: "POST",
        headers: authHeaders(sessionCookie),
        body: JSON.stringify(data)
    });

    if (!resp.ok) throw new Error("SERVER_ERROR");
}

export async function actualizarPolitica(
    sessionCookie: string,
    id: number,
    data: PoliticaAcceso
): Promise<void> {
    const resp = await fetch(`${API_BASE_URL}/api/mobile/politicas/${id}`, {
        method: "PUT",
        headers: authHeaders(sessionCookie),
        body: JSON.stringify(data)
    });

    if (!resp.ok) throw new Error("SERVER_ERROR");
}

export async function eliminarPolitica(
    sessionCookie: string,
    id: number
): Promise<void> {
    const resp = await fetch(`${API_BASE_URL}/api/mobile/politicas/${id}`, {
        method: "DELETE",
        headers: authHeaders(sessionCookie)
    });

    if (!resp.ok) throw new Error("SERVER_ERROR");
}
