"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("Country Info App API");
});
app.get("/countries", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch("https://date.nager.at/api/v3/AvailableCountries");
        const data = yield response.json();
        res.status(200).json(data);
    }
    catch (err) {
        res.status(400).send(err);
    }
}));
app.post("/country", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let parsedData = {};
        if (!req.body.id) {
            res.status(400).send('Must provide a country id');
            return;
        }
        const countryId = req.body.id;
        const infoResponse = yield fetch("https://date.nager.at/api/v3/CountryInfo/" + countryId);
        if (infoResponse.status !== 200) {
            res.status(infoResponse.status).send(infoResponse.statusText);
            return;
        }
        const infoData = yield infoResponse.json();
        const country = infoData.commonName;
        if (!country) {
            res.status(400).send('Missing country name');
            return;
        }
        parsedData = Object.assign(Object.assign({}, parsedData), infoData);
        const populationResponse = yield fetch("https://countriesnow.space/api/v0.1/countries/population", {
            method: "POST",
            body: JSON.stringify({ country }),
            headers: {
                'Content-Type': 'application/json'
            },
        });
        if (populationResponse.status !== 200) {
            res.status(populationResponse.status).send(populationResponse.statusText);
            return;
        }
        const populationData = yield populationResponse.json();
        parsedData = Object.assign(Object.assign({}, parsedData), { population: Object.assign({}, populationData.data) });
        const flagResponse = yield fetch("https://countriesnow.space/api/v0.1/countries/flag/images", {
            method: "POST",
            body: JSON.stringify({ country }),
            headers: {
                'Content-Type': 'application/json'
            },
        });
        if (flagResponse.status !== 200) {
            res.status(flagResponse.status).send(flagResponse.statusText);
            return;
        }
        const imageData = yield flagResponse.json();
        parsedData = Object.assign(Object.assign({}, parsedData), { flag: Object.assign({}, imageData.data) });
        res.status(200).json(parsedData);
    }
    catch (err) {
        res.status(400).send(err);
    }
}));
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
