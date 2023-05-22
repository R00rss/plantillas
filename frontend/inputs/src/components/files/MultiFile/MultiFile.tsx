import { useEffect, useRef, useState } from "react";
import Thumbnail from "./Thumbnail";
import { v4 as uuidv4 } from 'uuid';
import CancelButton from "../../buttons/CancelButton";
import { add_images } from "../../../services/images";

const DEFAULT_STYLES_DRAG_OVER = "mt-2 mx-auto w-[460px] h-[200px] p-2 border-2 border-solid border-blue-500 rounded-md flex flex-col items-center justify-center text-center cursor-pointer";
const DEFAULT_STYLES_DROP_ZONE = "mt-2 mx-auto w-[460px] h-[200px] p-2 border-2 border-dashed rounded-md border-gray-300 flex flex-col items-center justify-center text-center cursor-pointer";
const DEFAULT_PROMPT_TEXT = "Arrastra y suelta tus archivos aquí o haz click para seleccionarlos";

export default function MultiFile() {
    const input_ref = useRef<HTMLInputElement>(null);
    const [prompt_text, set_prompt_text] = useState(DEFAULT_PROMPT_TEXT);
    const [styles_drop_zone, set_styles_drop_zone] = useState(DEFAULT_STYLES_DROP_ZONE);
    const [form_data_files, set_form_data_files] = useState<FormData>(new FormData());
    const [selected_file, set_selected_file] = useState<File>();
    const [view_all_files, set_view_all_files] = useState(false);

    function reset_form_data() {
        set_form_data_files(new FormData());
    }

    function merge_form_data(form_data_1: FormData, form_data_2: FormData) {
        const result = new FormData();
        for (const pair of form_data_2.entries()) {
            result.append(pair[0], pair[1]);
        }
        for (const pair of form_data_1.entries()) {
            result.append(pair[0], pair[1]);
        }
        return result;
    }

    function handle_click(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        // e.preventDefault();
        e.stopPropagation();
        if (!input_ref.current) return;
        input_ref.current.click();
    }

    function on_change(e: React.ChangeEvent<HTMLInputElement>) {
        const files = e.target.files;
        if (!files) return;
        const fd = new FormData();
        for (let i = 0; i < files.length; i++) {
            fd.append("files", files.item(i) as File);
        }
        const aux = merge_form_data(form_data_files, fd);
        set_form_data_files(aux);
    }

    function on_drop(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        e.stopPropagation();
        const files_from_drop = e.dataTransfer.files;
        if (!files_from_drop) return;
        const fd = new FormData();
        for (let i = 0; i < files_from_drop.length; i++) {
            fd.append("files", files_from_drop.item(i) as File);
        }
        const aux = merge_form_data(form_data_files, fd);
        set_form_data_files(aux);

        set_styles_drop_zone(DEFAULT_STYLES_DROP_ZONE);
    }

    function on_drag_over(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        e.stopPropagation();
        set_styles_drop_zone(DEFAULT_STYLES_DRAG_OVER);
    }

    function on_drag_leave(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        e.stopPropagation();
        set_styles_drop_zone(DEFAULT_STYLES_DROP_ZONE);
    }
    function on_drag_end(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        e.stopPropagation();
        set_styles_drop_zone(DEFAULT_STYLES_DROP_ZONE);
    }
    const total_size = Array.from(form_data_files.getAll("files")).reduce((acc, file) => acc + (file as File).size, 0);


    useEffect(() => {
        console.log(form_data_files)
        const length = form_data_files.getAll("files").length;
        if (length === 0) return set_prompt_text(DEFAULT_PROMPT_TEXT);
        let message = ""
        const files = form_data_files.getAll("files")
        for (let i = 0; i < files.length; i++) {
            const file = files[i] as File;
            console.log(file.name)
            message += (file.name)
        }
        console.log(message)
        set_prompt_text(message)
        // form_data_files.getAll("files").length > 0 ? set_prompt_text("") : set_prompt_text(DEFAULT_PROMPT_TEXT);
    }, [form_data_files]);

    function handle_delete_file(file_name: string) {
        console.log(file_name)
        const aux = form_data_files.getAll("files").filter((file) => (file as File).name !== file_name);
        const fd = new FormData();X
        for (let i = 0; i < aux.length; i++) {
            fd.append("files", aux[i] as File);
        }
        set_form_data_files(fd);
        set_view_all_files(false);
    }
    function handle_preview(file_name: string) {
        const aux = form_data_files.getAll("files").filter((file) => (file as File).name !== file_name);
        if (aux.length === 0) return;
        const file = aux[0] as File;
        set_selected_file(file);
    }
    async function handle_send_files() {
        const response = await add_images(form_data_files);
        console.log(response)
    }

    return (
        <>
            <div
                onDrop={on_drop}
                onDragOver={on_drag_over}
                onDragEnd={on_drag_end}
                onDragLeave={on_drag_leave}
                onClick={handle_click}
                className={styles_drop_zone}
            >
                <input
                    className="hidden file:hidden"
                    ref={input_ref}
                    type="file"
                    onChange={on_change}
                    multiple
                />
                {form_data_files.getAll("files").length ?
                    <ul className="rounded-t-lg rounded-b-lg shadow-[2px_2px_10px_-2px] w-full flex flex-col gap-1 justify-center items-start">
                        <li
                            className="grid grid-cols-[1fr_3fr_1fr_1fr] w-full justify-center items-center bg-slate-800 text-slate-100 rounded-t-lg"
                        >
                            <div>#</div>
                            <div>Nombre</div>
                            <div>Peso</div>
                            <div></div>

                        </li>
                        {form_data_files.getAll("files").map((file, i) => {
                            const aux_file = file as File;
                            const aux_file_name = aux_file.name.length > 10 ? aux_file.name.slice(0, 20) + "..." : aux_file.name;
                            const aux_size = (aux_file.size / 1024).toFixed(2);
                            return <li
                                key={uuidv4()}
                                className="odd:bg-slate-300 even:bg-slate-100 grid grid-cols-[1fr_3fr_1fr_1fr] w-full justify-center items-center"
                            >
                                <div>{i + 1}</div>
                                <div
                                    onClick={() => handle_preview(aux_file.name)}
                                >
                                    {aux_file_name}
                                </div>
                                <div>
                                    {aux_size} KB
                                </div>
                                <div>
                                    <CancelButton
                                        type_button="button"
                                        handle_click={(event) => {
                                            event.preventDefault();
                                            event.stopPropagation();
                                            handle_delete_file(aux_file.name)
                                        }} />
                                </div>
                            </li>
                        })}

                        <li
                            className="
                            bg-slate-500 text-slate-100 rounded-b-lg
                            grid grid-cols-[1fr_3fr_1fr_1fr] w-full"
                        >
                            <span>Total: </span>
                            <div></div>
                            <div>
                                {(total_size / 1024).toFixed(2)} KB
                            </div>
                            <div></div>
                        </li>
                    </ul> : <p>{prompt_text}</p>}

            </div>
            <div className="flex justify-center items-center gap-2 py-2">

                <button
                    className="rounded-2xl w-[180px] p-1 bg-rose-500 text-rose-100 border-rose-500 border-2 hover:bg-rose-100 hover:text-rose-500 duration-500"
                    onClick={reset_form_data}
                >
                    Eliminar todo
                </button>
                <button
                    className="rounded-2xl w-[180px] p-1 bg-blue-500 text-blue-100 border-blue-500 border-2 hover:bg-blue-100 hover:text-blue-500 duration-500"
                    onClick={handle_send_files}
                >Guardar Imágenes</button>
                <button
                    className="rounded-2xl w-[180px] p-1 bg-slate-500 text-slate-100 border-slate-500 border-2 hover:bg-slate-100 hover:text-slate-500 duration-500"
                    onClick={() => set_view_all_files(!view_all_files)}
                >Ver todos los items</button>
            </div>
            {view_all_files ?
                <section className="w-full flex justify-center items-center flex-wrap gap-5">
                    {form_data_files.getAll("files").map((file) => {
                        return (
                            <Thumbnail key={uuidv4()} file={file as File} />
                        )
                    })
                    }
                </section>
                : selected_file && <Thumbnail file={selected_file} />
            }


        </>
    )
}

