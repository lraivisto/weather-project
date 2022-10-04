'use strict';

const http = require('http');
const path = require('path');
let configTiedostonNimi = 'config.json';

if (process.argv.length > 2) {
    configTiedostonNimi = process.argv[2];
} try {
    kaynnistaPalvelin(require(path.join(__dirname, configTiedostonNimi)));
} catch (virhe) {
    console.log(virhe.message);
}

function kaynnistaPalvelin(config) {
    const { port, host, varastokirjastokansio, varastokansio, kirjastokansio, resurssi } = config;
    const varastokirjastoPolku = path.join(__dirname, varastokirjastokansio);
    const varastoPolku = path.join(__dirname, varastokansio);
    const kirjastoPolku = path.join(__dirname, kirjastokansio, 'restApufunktiot');
    const statustiedostoPolku = path.join(varastokirjastoPolku, 'statuskoodit');
    const varastofunktioPolku = path.join(varastokirjastoPolku, 'varastoapufunktiot');
    const { luoTietovarasto } = require(path.join(varastokirjastoPolku, 'tietovarastokerros'));
    const tietovarasto = luoTietovarasto(statustiedostoPolku, varastofunktioPolku, varastoPolku);
    const { lahetaJson, lahetaOptionsVastaus, lahetaHead, kasitteleJson } = require(kirjastoPolku);

    const palvelin = http.createServer(async (req, res) => {
        const { pathname } = new URL(`http://${host}:${port}${req.url}`);
        const reitti = decodeURIComponent(pathname);

        try {
            const metodi = req.method.toUpperCase();
            if (metodi === 'OPTIONS') {
                lahetaOptionsVastaus(res);
            }
            else if (metodi === 'HEAD') {
                let body = {};
                if (reitti === `/api/${resurssi}`) {
                    body = await tietovarasto.haeKaikki();
                }
                else if (reitti.startsWith(`/api/${resurssi}/`)) {
                    const osat = reitti.split('/');
                    if (osat.length > 3) {
                        const perusavain = +osat[3];
                        body = await tietovarasto.hae(perusavain);
                    }
                }
                lahetaHead(res, body);
            } else if (reitti === `/api/${resurssi}`) {
                if (metodi === 'GET') {
                    const tulos = await tietovarasto.haeKaikki();
                    lahetaJson(res, tulos);
                }
            } else if (reitti.startsWith(`/api/${resurssi}/`)) {
                const osat = reitti.split('/');
                if (osat.length > 3) {
                    const perusavain = +osat[3];
                    switch (metodi) {
                        case 'GET':
                            tietovarasto.hae(perusavain)
                                .then(tulosGet => lahetaJson(res, tulosGet))
                                .catch(virhe => lahetaJson(res, virhe));
                            break;
                        default:
                            lahetaJson(res, { viesti: 'metodi ei käytössä' }, 405);
                    }
                }
            } else {
                lahetaJson(res, { viesti: 'resurssia ei ole' }, 405);
            }
        } catch (virhe) {
            lahetaJson(res, { viesti: virhe.message }, 404);
        }
    });
    palvelin.listen(port, host, () => console.log(`${host}:${port} palvelee...`));
}