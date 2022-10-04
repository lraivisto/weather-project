'use strict';

const lahetaJson = (res, jsonresurssi, statuskoodi = 200)=>{
    const jsonData = JSON.stringify(jsonresurssi);
    const jsonPituus = Buffer.byteLength(jsonData, 'utf8');
    res.statusCode = statuskoodi;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Length', jsonPituus);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.end(jsonData);
};

const lahetaOptionsVastaus = (res,statuskoodi=200)=>{
    res.statusCode=statuskoodi;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods','*');
    res.setHeader('Access-Control-Allow-Headers','Origin, Accept, Content-Type');
    res.setHeader('Content-Length',0);
    res.end();
}

const lahetaHead = (res, jsonresurssi, statuskoodi=200)=>{
    const jsonData = JSON.stringify(jsonresurssi);
    const jsonPituus=Buffer.byteLength(jsonData, 'utf8');
    res.statusCode=statuskoodi;
    res.setHeader('Content-Type','application/json');
    res.setHeader('Content-Length',jsonPituus);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.end();
}

const kasitteleJson = req => new Promise((resolve,reject)=>{
    if(req.headers['content-type'] !== 'application/json') {
        reject('tyyppi ei ole tuettu');
    } else {
        const datapuskuri=[];
        req.on('data', osa=>datapuskuri.push(osa));
        req.on('end', ()=>resolve(JSON.parse(Buffer.concat(datapuskuri).toString())));
        req.on('error', ()=>reject('virhe tiedonsiirrossa'));
    }
});
    
module.exports = {
    lahetaJson, 
    lahetaOptionsVastaus,
    lahetaHead,
    kasitteleJson
}