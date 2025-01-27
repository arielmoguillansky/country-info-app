import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Country Info App API");
});

app.get("/countries", async(req: Request, res: Response) => {
  try {
    const response = await fetch("https://date.nager.at/api/v3/AvailableCountries");
    const data = await response.json();
    res.status(200).json(data);

  } catch (err) {
    res.status(400).send(err);
  }
});

app.post("/country", async(req: Request, res: Response) => {
  try {
    let parsedData: any={}

    if (!req.body.id) {
      res.status(400).send('Must provide a country id');
      return
    }

    const countryId = req.body.id;
    const infoResponse = await fetch("https://date.nager.at/api/v3/CountryInfo/" + countryId);
    
    if(infoResponse.status !== 200){
      res.status(infoResponse.status).send(infoResponse.statusText);
      return
    }
    
    const infoData = await infoResponse.json();
    
    const country = infoData.commonName

    if (!country) {
      res.status(400).send('Missing country name');
      return
    }

    parsedData = {...parsedData, ...infoData};

    const populationResponse = await fetch("https://countriesnow.space/api/v0.1/countries/population", {
      method: "POST",
      body: JSON.stringify({country}),
      headers: {
        'Content-Type': 'application/json'
      },
    });
    
    if(populationResponse.status !== 200){
      res.status(populationResponse.status).send(populationResponse.statusText);
      return
    }

    const populationData = await populationResponse.json();

    parsedData = {...parsedData, population:{...populationData.data}};

    const flagResponse = await fetch("https://countriesnow.space/api/v0.1/countries/flag/images", {
      method: "POST",
      body: JSON.stringify({country}),
      headers: {
        'Content-Type': 'application/json'
      },
    });

    if(flagResponse.status !== 200){
      res.status(flagResponse.status).send(flagResponse.statusText);
      return
    }

    const imageData = await flagResponse.json();
    parsedData = {...parsedData, flag:{...imageData.data}};

    
    res.status(200).json(parsedData);

  } catch (err) {
    res.status(400).send(err);
  }
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});