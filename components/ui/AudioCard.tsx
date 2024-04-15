"use client"

import React, { FC } from "react";
import {
    Card,
    CardDescription,
    CardTitle,
} from "@/components/ui/card";

interface AudioCardProps {
    title: string;
    date: string;
}

const AudioCard: FC<AudioCardProps> = (props): JSX.Element => {
    return (
        
            <Card className="flex hover:bg-slate-100 p-3">

                <div className="col-span-2">
                    <div className="flex h-12 w-12 bg-slate-400 hover:bg-slate-700 items-center justify-center rounded-full border-3 border-muted">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-play-fill text-light" viewBox="0 0 16 16">
                            <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393"/>
                        </svg>
                    </div>
                </div>

                <div className="col-span-10 ms-3">
                    <CardTitle className="text-lg">
                        {props.title}
                    </CardTitle>
                    <CardDescription>
                        {props.date}
                    </CardDescription>
                </div>

            </Card>
    );
}


export default AudioCard;