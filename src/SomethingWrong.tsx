import { Button } from "./components/Button";

export function SomethingWrong(props: { show: boolean }) {
    function refresh() {
        window.location.reload()
    }
    
    return <>
        {props.show && (
            <div className="flex flex-col items-center justify-center fixed inset-0 bg-white z-100 gap-4">
                <div className="text-4xl font-bold text-primary">Aduh... Ada kesalahan teknis</div>
                <img src="broken-robot.png" className="w-[30%] my-4"/>
                <div className="text-xl font-bold text-gray-700">Tapi tenang, gak usah panik. Coba refresh halaman ini lagi atau click tombol di bawah ini...</div>
                <Button onClick={refresh}>Reload</Button>
            </div>
        )}
    </>
}