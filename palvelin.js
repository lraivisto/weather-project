'use strict';
const http = require('http');
const path = require('path');
const { port, host, verkkosivut, varastokansio, kirjastokansio } = require('./config.json');
const kirjastopolku=path.join(__dirname,kirjastokansio);
const {lue} = require(path.join(kirjastopolku,'tiedostokasittelija'));
const { laheta, onJoukossa, lahetaJson, lahetaStatus } = require(path.join(kirjastopolku,'apufunktiot'));

const resurssiReitit=['/favicon','/tyylit/','/js/'];
const valikkoPolku = path.join(__dirname,verkkosivut.kansio,verkkosivut.valikko);
const sivureitit = verkkosivut.sivureitit;


const palvelin = http.createServer(async (req,res)=>{
    const {pathname} = new URL(`http://${host}:${port}${req.url}`);
    const reitti = decodeURIComponent(pathname);

    const metodi = req.method.toUpperCase();

    if(metodi==='GET'){
        try {
            if(reitti==='/'){
                laheta(res,await lue(valikkoPolku));
            } else if (onJoukossa(reitti, ...resurssiReitit)) {
                laheta(res, await lue(path.join(__dirname, reitti)));
            } else {
                lahetaStatus(res, 'Resurssi ei ole käytössä');
            }
        } catch (virhe) {
            lahetaStatus(res, 'Virhe luettaessa resurssia');
        }
    } else {
        lahetaStatus(res, 'Metodi ei ole käytössä',405);
    }
});

palvelin.listen(port,host,
    ()=>console.log(`palvelin ${host}:${port} kuuntelee`));


