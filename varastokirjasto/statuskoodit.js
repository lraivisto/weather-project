'use strict';

const STATUSKOODIT = {
    OHJELMAVIRHE:0,
    EI_LOYTYNYT:1
}

const STATUSVIESTIT = {
    OHJELMAVIRHE: ()=>({
        viesti:'Anteeksi! Virhe ohjelmassamme',
        statuskoodi:STATUSKOODIT.OHJELMAVIRHE,
        tyyppi:'virhe'
    }),
    EI_LOYTYNYT: valmistusnro => ({
        viesti:`Annetulla perusavaimella ${valmistusnro} ei löytynyt tietoja`,
        statuskoodi:STATUSKOODIT.EI_LOYTYNYT,
        tyyppi:'virhe'
    })
}

module.exports={STATUSKOODIT, STATUSVIESTIT};