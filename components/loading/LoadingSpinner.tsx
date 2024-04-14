"use client";

import { useState, CSSProperties } from "react";
import ClipLoader from "react-spinners/ClipLoader";


const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "black",
};

function LoadingSpinner() {

    const [loading, setLoading] = useState(true);

    return (
        <ClipLoader 
            loading={loading} 
            cssOverride={override} 
            size={60} 
        />
    );
}


export default LoadingSpinner;
