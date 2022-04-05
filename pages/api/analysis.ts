import type {NextApiRequest, NextApiResponse} from 'next';
import formidable, {Fields, Files} from 'formidable';
import fs from 'fs';
import analyse from "../../src/analyze";

export const config = {
    api: {
        bodyParser: false,
    },
};

export default function handler(request: NextApiRequest, response: NextApiResponse): void {
    const form = new formidable.IncomingForm();

    form.parse(request, (error: any, fields: Fields, files: Files): void => {
        const content = fs.readFileSync((files.file as formidable.File).filepath, 'utf8');
        const analysis = analyse(content);

        response.status(200).json({content, analysis});
    })
}
