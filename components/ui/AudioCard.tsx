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
        
            <Card className="border-bottom-0 px-2 pt-2 pb-0">
                
                <div className="row">
                    <div className="col-2">
                        <div 
                            className="flex h-10 w-10 bg-slate-400 hover:bg-slate-700 items-center justify-center rounded-full border-4 border-muted" 
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-play-fill text-light" viewBox="0 0 16 16">
                                <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393"/>
                            </svg>
                        </div>
                    </div>

                    <div className="col-10">
                        <CardTitle className="text-lg">
                            {props.title}
                        </CardTitle>
                        <CardDescription>
                            {props.date}
                        </CardDescription>
                    </div>
                </div>

            </Card>
    );
}


export default AudioCard;