import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import axios from "axios";

import { useAuth } from "../../context/auth";
import Spinner from "../Spinner";


export default function AdminRoute() {
    const [success, setSuccess] = useState(false);
    const [auth, setAuth] = useAuth();

    useEffect(() => {
        const authCheck = async() => {
            const res = await axios.get("/api/v1/auth/admin-auth")

            if(res.data.success) {
                setSuccess(true);
            } else {
                setSuccess(false);
            }
        }
        if(auth?.token) authCheck();
    }, [auth?.token]); 

    return success ? <Outlet /> : <Spinner path=""/>
}