import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";
import { formatDateForInput } from "../utils/dateUtils";
import * as client from "./client";

export default function Profile() {
    const [profile, setProfile] = useState<any>({});
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentUser } = useSelector((state: any) => state.accountReducer);

    const updateProfile = async () => {
        const updatedProfile = await client.updateUser(profile);
        dispatch(setCurrentUser(updatedProfile));
    };

    const fetchProfile = () => {
        if (!currentUser) {
            navigate("/Kanbas/Account/Signin");
            return;
        }
        setProfile(currentUser);
    };

    const signout = async () => {
        await client.signout();
        dispatch(setCurrentUser(null));
        navigate("/Kanbas/Account/Signin");
    };

    useEffect(() => { fetchProfile(); }, [currentUser]);

    const handleDateChange = (value: string) => {
        if (!value) {
            setProfile({
                ...profile,
                dob: ""
            });
            return;
        }
        const date = new Date(value);
        const isoString = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            date.getMinutes()
        ).toISOString();

        setProfile({
            ...profile,
            dob: isoString
        });
    };

    return (
        <div id="wd-profile-screen">
            <h3>Profile</h3>
            {profile && (
                <div>
                    <input 
                        value={profile.username || ''} 
                        id="wd-username" 
                        className="form-control mb-2"
                        onChange={(e) => setProfile({ 
                            ...profile, 
                            username: e.target.value 
                        })}
                    />
                    <input 
                        value={profile.password || ''} 
                        id="wd-password" 
                        className="form-control mb-2"
                        type="password"
                        onChange={(e) => setProfile({ 
                            ...profile, 
                            password: e.target.value 
                        })}
                    />
                    <input 
                        value={profile.firstName || ''} 
                        id="wd-firstname" 
                        className="form-control mb-2"
                        onChange={(e) => setProfile({ 
                            ...profile, 
                            firstName: e.target.value 
                        })}
                    />
                    <input 
                        value={profile.lastName || ''} 
                        id="wd-lastname" 
                        className="form-control mb-2"
                        onChange={(e) => setProfile({ 
                            ...profile, 
                            lastName: e.target.value 
                        })}
                    />
                    <input 
                        value={formatDateForInput(profile.dob)?.split('T')[0] || ''} 
                        id="wd-dob" 
                        className="form-control mb-2"
                        onChange={(e) => handleDateChange(e.target.value)} 
                        type="date"
                    />
                    <input 
                        value={profile.email || ''} 
                        id="wd-email" 
                        className="form-control mb-2"
                        onChange={(e) => setProfile({ 
                            ...profile, 
                            email: e.target.value 
                        })}
                    />
                    <select 
                        value={profile.role || 'USER'}
                        onChange={(e) => setProfile({ 
                            ...profile, 
                            role: e.target.value 
                        })}
                        className="form-control mb-2" 
                        id="wd-role"
                    >
                        <option value="USER">User</option>
                        <option value="ADMIN">Admin</option>
                        <option value="FACULTY">Faculty</option>
                        <option value="STUDENT">Student</option>
                        <option value="TA">TA</option>
                    </select>
                    <button 
                        onClick={updateProfile} 
                        className="btn btn-primary w-100 mb-2"
                    >
                        Update
                    </button>
                    <button 
                        onClick={signout} 
                        className="btn btn-danger w-100 mb-2" 
                        id="wd-signout-btn"
                    >
                        Sign out
                    </button>
                </div>
            )}
        </div>
    );
}
