import React, { useEffect, useState, useRef } from 'react';

interface AudioTranscriptProps {
    text: string;
    speed: number;  
}


const AudioTranscript: React.FC<AudioTranscriptProps> = ({ text, speed }) => {

    const [displayText, setDisplayText] = useState<string>('');
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    const transcriptRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {

        const typingInterval = setInterval(() => {

            if (currentIndex < text.length) {
                setDisplayText(text.substring(0, currentIndex + 1));
                setCurrentIndex(currentIndex + 1);
            }
            else {
                clearInterval(typingInterval);

                if (transcriptRef.current) {
                    transcriptRef.current.scrollIntoView({ behavior: 'smooth' });
                }
            }

        }, speed);

        return () => clearInterval(typingInterval);
    }, [text, speed, currentIndex]);

    return (
        <span ref={transcriptRef} tabIndex={-1} className="text-muted-foreground self-start">
            {displayText}
        </span>
    );
}   

export default AudioTranscript;