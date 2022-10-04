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

    async function haeYksiVarastosta(arvo) {
        return (await lueVarasto(varastoPolku))
            .find(olio => olio[perusavain] == arvo) || null;
    }

    return {
        haeKaikkiVarastosta,
        haeYksiVarastosta,
        perusavain
    }
}

module.exports = { luoVarastokerros };