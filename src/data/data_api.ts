import { apiGet } from "./api"

export type NegaraData = {
    id_negara: number
    kode_negara: string
    nama_negara: string
}

export type PelabuhanData = {
    id_pelabuhan: string
    nama_pelabuhan: string
    id_negara: string
}

export type BarangData = {
    id_barang: number
    nama_barang: string
    id_pelabuhan: number
    description: string
    diskon: number
    harga: number
}

class Api {
    async getNegaras(): Promise<NegaraData[]> {
        return apiGet("negaras")
    }
    
    async getPelabuhans(idNegara: number | string): Promise<PelabuhanData[]> {
        return apiGet(`pelabuhans?filter={"where":{"id_negara":${idNegara}}}`)
    }
    
    async getBarangs(idPelabuhan: number | string): Promise<BarangData[]> {
        return apiGet(`barangs?filter={"where":{"id_pelabuhan":${idPelabuhan}}}`)
    }
}

export const DataApi = new Api()