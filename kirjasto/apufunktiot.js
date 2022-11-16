'use strict';

const laheta = (res,resurssi,statuskoodi=200)=>{
    res.writeHead(statuskoodi, {
        'Content-Type':resurssi.mime.tyyppi,
        'Content-Length':Buffer.byteLength(resurssi.tiedostoData,
            resurssi.mime.koodaus)
    });
    res.end(resurssi.tiedostoData, resurssi.mime.koodaus);
};

const onJoukossa = (reitti, ...reittienAlkuosat)=>{
    for(let alku of reittienAlkuosat){
        if(reitti.startsWith(alku)) return true;
    }
    return false;
};

const lahetaJson = (res, jsonresurssi, statuskoodi=200)=>{
    const jsonData=JSON.stringify(jsonresurssi);
    res.writeHead(statuskoodi, {
        'Content-Type':'application/json'
    });
    res.end(jsonData);
}

const lahetaStatus = (res, viesti, statuskoodi=404)=>{
    lahetaJson(res,{viesti},statuskoodi);
    //lahetaJson(res, { viesti:viesti }, statuskoodi);
}

module.exports = { laheta, onJoukossa, lahetaJson, lahetaStatus};