import express, {Request, Response} from 'express';

const app = express()

app.use(express.json())

app.get('/', ( _req:Request, res: Response) => {
    res.send("Hola Mundo")
});

const PORT:number = 8080

app.listen(PORT, () => console.log("App listening on port " + PORT))
