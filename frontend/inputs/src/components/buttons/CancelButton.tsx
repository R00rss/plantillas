import cancel_icon from "../../assets/images/cross.png";

interface props {
    handle_click: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
    type_button: string
}
const TYPE_BUTTON = {
    alert: "alert",
}
export default function CancelButton({
    handle_click,
    type_button
}: props) {


    return (
        <button
            onClick={handle_click}
            className={`${type_button === TYPE_BUTTON.alert ? "absolute right-2 top-2" : ""} outline-purple-700  w-[30px] duration-300 group bg-rose-500 border-2 border-rose-500 hover:bg-transparent rounded-full p-1`}
        >
            <img
                className="duration-300 filter group-hover:filter-none brightness-0 invert"
                src={cancel_icon}
                alt="cancel_icon"
            />
        </button >
    )
}
