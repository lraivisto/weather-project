'use strict';

const http = require('http');
const path = require('path');
let configTiedostonNimi = 'config_rest.json';

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
            } else if (metodi === `GET`) {
                if (reitti === `/api/kaikki`) {
                    const tulos = await tietovarasto.haeKaikki();
                    lahetaJson(res, tulos);
                } else if (reitti.startsWith(`/api/${resurssi}/`)) {
                    const osat = reitti.split(`/`);
                    const perusavain = +osat[3];
                    tietovarasto.hae2(perusavain)
                        .then(tulosGet => lahetaJson(res, tulosGet))
                        .catch(virhe => lahetaJson(res, virhe));
                } else if (reitti.startsWith(`/api/lampo/${resurssi}`)) {
                    const osat = reitti.split(`/`);
                    const perusavain = +osat[4];
                    tietovarasto.hae2(perusavain, `lampo`)
                        .then(tulosGet => lahetaJson(res, tulosGet))
                        .catch(virhe => lahetaJson(res, virhe));
                } else if (reitti.startsWith(`/api/sade/${resurssi}/`)) {
                    const osat = reitti.split(`/`);
                    const perusavain = +osat[4];
                    tietovarasto.hae2(perusavain, `sade`)
                        .then(tulosGet => lahetaJson(res, tulosGet))
                        .catch(virhe => lahetaJson(res, virhe));
                } else if (reitti.startsWith(`/api/pilvisyys/${resurssi}`)) {
                    const osat = reitti.split(`/`);
                    const perusavain = +osat[4];
                    tietovarasto.hae2(perusavain, `pilvisyys`)
                        .then(tulosGet => lahetaJson(res, tulosGet))
                        .catch(virhe => lahetaJson(res, virhe));
                } else {
                    lahetaJson(res, { viesti: 'resurssia ei ole' }, 405);
                }
            }
        } catch (virhe) { lahetaJson(res, { viesti: virhe.message }, 404); }
    });
    palvelin.listen(port, host, () => console.log(`${host}:${port} palvelee...`));
}