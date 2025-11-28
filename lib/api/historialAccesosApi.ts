export const API_BASE_URL = "http://hcenuy.web.elasticloud.uy/Laboratorio";

export interface HistorialAcceso {
    id: number;
    fecha: string;
    prestador: string;
    tipo: string;
    detalle?: string;
    ip?: string;
}

export async function fetchHistorialAccesos(sessionCookie: string): Promise<HistorialAcceso[]> {
    const resp = await fetch(`${API_BASE_URL}/api/mobile/historial-accesos`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Cookie: `JSESSIONID=${sessionCookie}`
        }
    });

    if (resp.status === 401) {
        throw new Error("UNAUTHORIZED");
    }

    if (resp.status === 404) {
        return [];
    }

    if (!resp.ok) {
        const t = await resp.text().catch(() => "");
        console.log("Error backend:", t);
        throw new Error("SERVER_ERROR");
    }

    return (await resp.json()) as HistorialAcceso[];
}
