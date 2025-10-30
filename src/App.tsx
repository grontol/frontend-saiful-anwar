import { useEffect, useMemo, useState } from "react"
import { Button } from "./components/Button"
import { SelectInput, type OptionItem } from "./components/SelectInput"
import { DataApi, type BarangData } from "./data/data_api"
import { TextInput } from "./components/TextInput"
import { rpize } from "./data/utils"
import { twMerge } from "tailwind-merge"
import { SomethingWrong } from "./SomethingWrong"

function App() {
    const [negaras, setNegaras] = useState<OptionItem[]>([])
    const [pelabuhans, setPelabuhans] = useState<OptionItem[]>([])
    const [barangs, setBarangs] = useState<(OptionItem & BarangData)[]>([])
    
    const [negaraLoading, setNegaraLoading] = useState(false)
    const [pelabuhanLoading, setPelabuhanLoading] = useState(false)
    const [barangLoading, setBarangLoading] = useState(false)
    
    const [selectedNegara, setSelectedNegara] = useState("")
    const [selectedPelabuhan, setSelectedPelabuhan] = useState("")
    const [selectedBarang, setSelectedBarang] = useState("")
    
    const [discount, setDiscount] = useState(0)
    const [harga, setHarga] = useState(0)
    
    const barang = useMemo(() => {
        return barangs.find(x => x.id_barang.toString() === selectedBarang)
    }, [selectedBarang, barangs])
    
    const [somethingWrong, setSomethingWrong] = useState(false)
    
    useEffect(() => {
        setDiscount(barang?.diskon ?? 0)
        setHarga(barang?.harga ?? 0)
    }, [barang])
    
    const total = useMemo(() => {
        const res = discount * harga
        return res ? rpize(res) : ""
    }, [discount, harga])
    
    function reset() {
        setSelectedNegara("")
    }
    
    useEffect(() => {
        setNegaraLoading(true)
        
        DataApi.getNegaras()        
            .then(res => setNegaras(res.map(x => ({
                    text: `${x.kode_negara} - ${x.nama_negara}`,
                    value: x.id_negara.toString(),
            }))))
            .catch(e => {
                console.log(e)
                setSomethingWrong(true)
            })
            .finally(() => {
                setNegaraLoading(false)
            })
    }, [])
    
    useEffect(() => {
        setPelabuhans([])
        setBarangs([])
        
        setSelectedPelabuhan("")
        setSelectedBarang("")
        
        if (!selectedNegara) {
            return
        }
        
        setPelabuhanLoading(true)
        
        DataApi.getPelabuhans(selectedNegara)
            .then(res => setPelabuhans(res.map(x => ({
                text: x.nama_pelabuhan,
                value: x.id_pelabuhan,
            }))))
            .catch(e => {
                console.log(e)
                setSomethingWrong(true)
            })
            .finally(() => {
                setPelabuhanLoading(false)
            })
    }, [selectedNegara])
    
    useEffect(() => {
        setBarangs([])
        setSelectedBarang("")
        
        if (!selectedPelabuhan) {
            return
        }
        
        setBarangLoading(true)
        
        DataApi.getBarangs(selectedPelabuhan)
            .then(res => setBarangs(res.map(x => ({
                text: `${x.id_barang} - ${x.nama_barang}`,
                value: x.id_barang.toString(),
                ...x,
            }))))
            .catch(e => {
                console.log(e)
                setSomethingWrong(true)
            })
            .finally(() => {
                setBarangLoading(false)
            })
    }, [selectedPelabuhan])
    
    return <div className="p-8 h-screen overflow-auto flex flex-col gap-4 bg-linear-to-br from-white to-primary/20">
        <div>
            <h2 className="text-2xl font-bold text-center text-primary-dark">Test Frontend Developer</h2>
            <h3 className="text-lg font-bold text-center text-gray-500">(Saiful Anwar)</h3>
        </div>
        
        <SomethingWrong show={somethingWrong}/>
        
        <SelectInput
            label="Negara"
            placeholder={negaraLoading ? "Loading..." : "Pilih negara"}
            options={negaras}
            value={selectedNegara}
            onChange={v => setSelectedNegara(v)}
            clearable={true}
        />
        
        <SelectInput
            label="Pelabuhan"
            placeholder={pelabuhanLoading ? "Loading..." : !selectedNegara ? "Pilih negara terlebuh dahulu" : "Pilih pelabuhan"}
            options={pelabuhans}
            value={selectedPelabuhan}
            onChange={v => setSelectedPelabuhan(v)}
            clearable={true}
        />
        
        <SelectInput
            label="Barang"
            placeholder={barangLoading ? "Loading..." : !selectedPelabuhan ? "Pilih pelabuhan terlebih dahulu" : "Pilih barang"}
            options={barangs}
            value={selectedBarang}
            onChange={v => setSelectedBarang(v)}
            clearable={true}
        />
        
        <div
            className={twMerge(
                "border border-black-extra-light transition-colors rounded outline-none px-3 py-1.5 min-h-16 bg-gray-400/10",
                barang?.description ? "" : "text-gray-400"
            )}
        >{barang?.description ?? "Barang belum dipilih"}</div>
        
        <TextInput
            label="Discount"
            type="number"
            value={discount ? discount.toString() : ""}
            onChange={v => setDiscount(+v)}
        />
        
        <TextInput
            label="Harga"
            type="number"
            value={harga ? harga.toString() : ""}
            onChange={v => setHarga(+v)}
        />
        
        <TextInput
            label="Total"
            value={total}
            disabled={true}
        />
        
        <Button
            className="self-end"
            onClick={reset}
        >Reset</Button>
    </div>
}

export default App
