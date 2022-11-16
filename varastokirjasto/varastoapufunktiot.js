'use strict';

const path = require('path');

function luoVarastokerros(varastoKansioPolku) {
    const varastoConfigPolku = path.join(varastoKansioPolku, 'varastoConfig.json');
    const { varastotiedosto, perusavain, varastokasittelija } = require(varastoConfigPolku);
    const varastoPolku = path.join(varastoKansioPolku, varastotiedosto);
    const { lueVarasto } = require(path.join(varastoKansioPolku, varastokasittelija));

    async function haeKaikkiVarastosta() {
        return lueVarasto(varastoPolku);
    }

    async function haeYksiArvo(arvo, avain) {
        const mdata = (await lueVarasto(varastoPolku)).find(olio => olio[perusavain] == arvo);
        if (mdata) {
            const datatable = [];
            for (let paiva of mdata.data) {
                if (avain === `lampo`) {
                    datatable.push(paiva.lampo)
                } else if (avain === `sade`) {
                    datatable.push(paiva.sade)
                } else if (avain === `pilvisyys`) {
                    datatable.push(paiva.pilvisyys)
                } else return mdata;
            }
            return datatable;
        }
        return [];
    }
    async function haeYksi(arvo) {
        return (await lueVarasto(varastoPolku))
            .find(olio => olio[perusavain] == arvo) || null;
    }

    return {
        haeKaikkiVarastosta,
        haeYksi,
        haeYksiArvo,
        perusavain
    }
}

module.exports = { luoVarastokerros };