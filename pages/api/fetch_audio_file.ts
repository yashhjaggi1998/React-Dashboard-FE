import { NextApiRequest, NextApiResponse } from 'next';
import fs, { write } from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {

    let segmentName = req.query.segmentName as string;
    const fileName = segmentName.replace(" ", "_") + '_Audio.wav';

    const filePath = path.join(process.cwd(), 'public/AudioRecordings', fileName);
    const stat = fs.statSync(filePath);

    res.writeHead(200, {
        'Content-Type': 'audio/wav',
        'Content-Length': stat.size,
    });
    
    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
}
