import { useEffect, useRef } from "react";
interface Props {
    file: File
}

export default function Thumbnail({ file }: Props) {
    const file_name = file.name;
    const ref_thumbnail = useRef<HTMLDivElement>(null);
    useEffect(() => {
        console.log(file_name);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            if (ref_thumbnail.current === null) return;
            ref_thumbnail.current.style.backgroundImage = `url('${reader.result}')`;
        }
    }, [])

    return (
        <section className=" shadow-[2px_2px_10px_-2px] rounded-t-3xl rounded-b-xl aspect-square w-[250px] flex flex-col gap-2 justify-center items-center">
            <div className="w-full h-full p-4 flex justify-center items-center">
                <div className="rounded-t-3xl w-full h-full overflow-hidden bg-cover bg-no-repeat" ref={ref_thumbnail}></div>
            </div>
            <p className="rounded-b-xl text-center w-full bg-slate-200 text-slate-900 py-1">{file_name}</p>
        </section>
    )
}
