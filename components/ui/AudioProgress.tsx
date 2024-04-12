import React, {FC} from 'react';

interface AudioProgressProps {
    audioSrc: string;
}

export const AudioProgress: FC<AudioProgressProps> = (audioSrc) => {

    return (
        <div className="audio-progress">
            <audio controls>
                <source src={audioSrc} type="audio/mpeg" />
                Your browser does not support the audio element.
            </audio>
        </div>
    );
}