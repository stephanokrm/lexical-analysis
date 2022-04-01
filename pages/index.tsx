import {useState} from "react";
import axios from "axios";
import {
    Button,
    LinearProgress,
    Container,
    Grid,
    List,
    ListSubheader,
    ListItem,
    ListItemText,
    Divider
} from "@mui/material";

export default function Home() {
    const [progress, setProgress] = useState(0);
    const [content, setContent] = useState();
    const [lines, setLines] = useState([]);
    const [symbols, setSymbols] = useState([]);
    const [errors, setErrors] = useState([]);

    const onChange = event => {
        const config = {
            headers: {'Content-Type': 'multipart/form-data'},
            onUploadProgress: (event) => {
                setProgress(Math.round((event.loaded * 100) / event.total));
            },
        };

        const formData = new FormData();
        formData.append("file", event.target.files[0]);

        axios.post('/api/analysis', formData, config).then(response => {
            setProgress(0);
            setContent(response.data.analysis.content);
            setLines(response.data.analysis.lines);
            setSymbols(response.data.analysis.symbols);
            setErrors(response.data.analysis.errors);
        });
        event.target.value = null;
    };

    return (
        <Container maxWidth="xl">
            <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12}>
                    <LinearProgress variant="determinate" value={progress}/>
                </Grid>
                <Grid item xs={12}>
                    <Grid container spacing={2} justifyContent="center">
                        <Grid item>
                            <label htmlFor="file">
                                <input
                                    id="file"
                                    name="file"
                                    style={{display: 'none'}}
                                    accept="text/plain"
                                    type="file"
                                    onChange={onChange}/>
                                <Button component="span">Escolher Arquivo</Button>
                            </label>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid xs={12} md={6}>
                    <pre>
                    {content}
                        </pre>
                </Grid>
                <Grid xs={12} md={2}>
                    <List
                        subheader={
                            <ListSubheader>
                                Linhas
                            </ListSubheader>
                        }
                    >
                        {lines.map(line => (
                            <>
                                <ListItem>
                                    <ListItemText primary={line}/>
                                </ListItem>
                                <Divider/>
                            </>
                        ))}
                    </List>
                </Grid>
                <Grid xs={12} md={2}>
                    <List
                        subheader={
                            <ListSubheader>
                                Símbolos
                            </ListSubheader>
                        }
                    >
                        {symbols.map(symbol => (
                            <>
                                <ListItem>
                                    <ListItemText primary={symbol}/>
                                </ListItem>
                                <Divider/>
                            </>
                        ))}
                    </List>
                </Grid>
                <Grid xs={12} md={2}>
                    <List
                        subheader={
                            <ListSubheader>
                                Erros
                            </ListSubheader>
                        }
                    >
                        {errors.map(error => (
                            <>
                                <ListItem>
                                    <ListItemText primary={error}/>
                                </ListItem>
                                <Divider/>
                            </>
                        ))}
                    </List>
                </Grid>
            </Grid>
        </Container>
    )
}
