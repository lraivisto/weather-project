'use strict';

function luoTietovarasto(statuspolku, varastofunktiopolku, varastotiedostopolku) {

    const { STATUSKOODIT, STATUSVIESTIT } = require(statuspolku);
    const { luoVarastokerros } = require(varastofunktiopolku);
    const { haeKaikkiVarastosta, haeYksiVarastosta } = luoVarastokerros(varastotiedostopolku);

    class Tietovarasto {
        get STATUSKOODIT() {
            return STATUSKOODIT;
        }
        haeKaikki() {
            return haeKaikkiVarastosta();
        }
        hae(arvo) {
            return new Promise(async (resolve, reject) => {
                if (!arvo) {
                    reject(STATUSVIESTIT.EI_LOYTYNYT('--tyhjä--'));
                } else {
                    const tulos = await haeYksiVarastosta(arvo);
                    if (tulos) {
                        resolve(tulos);
                    } else {
                        reject(STATUSVIESTIT.EI_LOYTYNYT(arvo));
                    }
                }
            });
        }
    }

    return new Tietovarasto();

}

module.exports = { luoTietovarasto };