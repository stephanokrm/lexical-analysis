import {Button, LinearProgress} from "@mui/material";
import axios from "axios";
import {useState} from "react";

export default function Home() {
    const [progress, setProgress] = useState(0);

    const onChange = event => {
        const config = {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress: (event) => {
                setProgress(Math.round((event.loaded * 100) / event.total));
            },
        };

        const formData = new FormData();
        formData.append("file", event.target.files[0]);

        axios.post('/api/analysis', formData, config).then();
        event.target.value = null;
    };

  return (
      <>
          <LinearProgress variant="determinate" value={progress} />
          <label htmlFor="file">
              <input
                  id="file"
                  name="file"
                  style={{ display: 'none' }}
                  accept="text/plain"
                  type="file"
                  onChange={onChange} />
              <Button component="span">Escolher Arquivo</Button>
          </label>
      </>
  )
}
