import { IoEllipsisVertical } from "react-icons/io5";
import GreenCheckmark from "./GreenCheckmark";
import { useSelector } from "react-redux";
import { isFaculty } from "../../utils/permissions";

export default function LessonControlButtons() {
    const { currentUser } = useSelector((state: any) => state.accountReducer);

    return (
        <div>
            {isFaculty(currentUser) && (
                <>
                    <GreenCheckmark />
                    <IoEllipsisVertical className="fs-4" />
                </>
            )}
        </div>
    );
}
