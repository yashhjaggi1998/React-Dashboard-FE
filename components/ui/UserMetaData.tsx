import React, { useEffect, useState, useRef } from 'react';

interface UserMetaDataProps {
    data : {
        Result: string;
        Position: string;
        User: string;
        TimeTaken: string;
        Date: string;
    }
}

export const UserMetaData: React.FC<UserMetaDataProps> = ({data}) => {
    
    return (
        <div>
            <div className="flex border-bottom px-3 py-3 items-start">
                                                
                { data.Result === "Strong Hire" ? 
                    ( 
                        <span className="relative flex rounded-full h-9 w-9">
                            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="bi bi-shield-fill-check inline-block text-success" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M8 0c-.69 0-1.843.265-2.928.56-1.11.3-2.229.655-2.887.87a1.54 1.54 0 0 0-1.044 1.262c-.596 4.477.787 7.795 2.465 9.99a11.8 11.8 0 0 0 2.517 2.453c.386.273.744.482 1.048.625.28.132.581.24.829.24s.548-.108.829-.24a7 7 0 0 0 1.048-.625 11.8 11.8 0 0 0 2.517-2.453c1.678-2.195 3.061-5.513 2.465-9.99a1.54 1.54 0 0 0-1.044-1.263 63 63 0 0 0-2.887-.87C9.843.266 8.69 0 8 0m2.146 5.146a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793z"/>
                            </svg>
                        </span>
                    ) : (
                        <span className="relative flex rounded-full h-9 w-9">
                            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="bi bi-shield-fill-exclamation text-warning" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M8 0c-.69 0-1.843.265-2.928.56-1.11.3-2.229.655-2.887.87a1.54 1.54 0 0 0-1.044 1.262c-.596 4.477.787 7.795 2.465 9.99a11.8 11.8 0 0 0 2.517 2.453c.386.273.744.482 1.048.625.28.132.581.24.829.24s.548-.108.829-.24a7 7 0 0 0 1.048-.625 11.8 11.8 0 0 0 2.517-2.453c1.678-2.195 3.061-5.513 2.465-9.99a1.54 1.54 0 0 0-1.044-1.263 63 63 0 0 0-2.887-.87C9.843.266 8.69 0 8 0m-.55 8.502L7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0M8.002 12a1 1 0 1 1 0-2 1 1 0 0 1 0 2"/>
                            </svg>
                        </span>
                    )
                }
                
                <div className="text-xl font-bold space-y-1">
                    <p className="leading-none mb-2">
                        {data.Result}
                    </p>
                    <p className="text-sm text-muted-foreground leadin-none">
                        {data.Position}
                    </p>
                </div>

            </div>

            <div className="grid grid-rows-3 gap-2 px-3 pt-4 pb-4">
                    
                <div className="flex items-center mb-2">
                    <span className="relative flex shrink-0 rounded-full h-9 w-9">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-person-fill" viewBox="0 0 16 16">
                            <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                        </svg>
                    </span>

                    <div className="space-y-1">
                        <p className="text-base text-muted-foreground font-semibold leading-none mb-2">
                            Candidate
                        </p>
                        <p className="text-sm text-muted-foreground leadin-none">
                            {data.User}
                        </p>
                    </div>
                </div>

                <div className="flex items-center mb-2">
                    <span className="relative flex rounded-full h-9 w-9">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-alarm" viewBox="0 0 16 16">
                            <path d="M8.5 5.5a.5.5 0 0 0-1 0v3.362l-1.429 2.38a.5.5 0 1 0 .858.515l1.5-2.5A.5.5 0 0 0 8.5 9z"/>
                            <path d="M6.5 0a.5.5 0 0 0 0 1H7v1.07a7.001 7.001 0 0 0-3.273 12.474l-.602.602a.5.5 0 0 0 .707.708l.746-.746A6.97 6.97 0 0 0 8 16a6.97 6.97 0 0 0 3.422-.892l.746.746a.5.5 0 0 0 .707-.708l-.601-.602A7.001 7.001 0 0 0 9 2.07V1h.5a.5.5 0 0 0 0-1zm1.038 3.018a6 6 0 0 1 .924 0 6 6 0 1 1-.924 0M0 3.5c0 .753.333 1.429.86 1.887A8.04 8.04 0 0 1 4.387 1.86 2.5 2.5 0 0 0 0 3.5M13.5 1c-.753 0-1.429.333-1.887.86a8.04 8.04 0 0 1 3.527 3.527A2.5 2.5 0 0 0 13.5 1"/>
                        </svg>
                    </span>

                    <div className="space-y-1">
                        <p className="text-base text-muted-foreground font-semibold leading-none mb-2">
                            Time Taken
                        </p>
                        <p className="text-sm text-muted-foreground leadin-none">
                            {data.TimeTaken}
                        </p>
                    </div>
                </div>

                <div className="flex items-center mb-2">
                    <span className="relative flex rounded-full h-9 w-9">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-calendar-date" viewBox="0 0 16 16">
                            <path d="M6.445 11.688V6.354h-.633A13 13 0 0 0 4.5 7.16v.695c.375-.257.969-.62 1.258-.777h.012v4.61zm1.188-1.305c.047.64.594 1.406 1.703 1.406 1.258 0 2-1.066 2-2.871 0-1.934-.781-2.668-1.953-2.668-.926 0-1.797.672-1.797 1.809 0 1.16.824 1.77 1.676 1.77.746 0 1.23-.376 1.383-.79h.027c-.004 1.316-.461 2.164-1.305 2.164-.664 0-1.008-.45-1.05-.82zm2.953-2.317c0 .696-.559 1.18-1.184 1.18-.601 0-1.144-.383-1.144-1.2 0-.823.582-1.21 1.168-1.21.633 0 1.16.398 1.16 1.23"/>
                            <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/>
                        </svg>
                    </span>

                    <div className="space-y-1">
                        <p className="text-base text-muted-foreground font-semibold leading-none mb-2">
                            Date
                        </p>
                        <p className="text-sm text-muted-foreground leadin-none">
                            {data.Date}
                        </p>
                    </div>
                </div>
            
            </div>
        </div>
    );
}