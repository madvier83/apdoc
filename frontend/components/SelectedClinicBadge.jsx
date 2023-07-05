import { useAtom } from "jotai";
import { clinicAtom } from "../services/Atom";

export default function SelectedClinicBadge() {
    const [clinicInfo, setClinicInfo] = useAtom(clinicAtom);

    return (
        <>
        <small className={`${!clinicInfo?.name && "hidden"} font-semibold bg-emerald-300 rounded-md px-2`}>
            Clinic: {clinicInfo?.name || ""}
        </small>
        </>
    );
}
