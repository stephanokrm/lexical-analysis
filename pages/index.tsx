import {useState} from "react";
import axios, {AxiosRequestConfig} from "axios";
import SyntaxHighlighter from 'react-syntax-highlighter';
import {materialDark} from 'react-syntax-highlighter/dist/cjs/styles/prism';
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
    const [progress, setProgress] = useState<number>(0);
    const [content, setContent] = useState<string>();
    const [tokens, setTokens] = useState<string[]>([]);
    const [symbols, setSymbols] = useState<string[]>([]);
    const [errors, setErrors] = useState<string[]>([]);

    const onChange = event => {
        const config: AxiosRequestConfig = {
            headers: {'Content-Type': 'multipart/form-data'},
            onUploadProgress: (event: any) => {
                setProgress(Math.round((event.loaded * 100) / event.total));
            },
        };

        const formData = new FormData();
        formData.append("file", event.target.files[0]);

        axios.post('/api/analysis', formData, config).then(response => {
            setProgress(0);
            setContent(response.data.content);
            setTokens(response.data.analysis.tokens);
            setSymbols(response.data.analysis.symbols);
            setErrors(response.data.analysis.errors);
        });

        event.target.value = null;
    };

    return (
        <Container maxWidth="xl">
            <Grid container spacing={5}>
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
                                <Button component="span" variant="contained">Escolher Arquivo</Button>
                            </label>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid xs={12} md={6}>
                    <SyntaxHighlighter showLineNumbers style={materialDark}>
                        {content}
                    </SyntaxHighlighter>
                </Grid>
                <Grid xs={12} md={2}>
                    <List
                        subheader={
                            <ListSubheader>
                                Tokens de Entrada
                            </ListSubheader>
                        }
                    >
                        {tokens.map(line => (
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
                                Tabela de Símbolos
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
                                Erros Nas Linhas
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
