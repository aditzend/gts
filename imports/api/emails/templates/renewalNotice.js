export default function (customerGivenName, boughtProduct, ownerName, ownerFormalName, ownerFacebookPage, ownerSite, ownerFacebookReviewsPage, ownerEmail, ownerDescription, ownerAddress, ownerAttentionSchedule) {
    return `Hola ${customerGivenName}, te avisamos que es hora de cambiar ${boughtProduct}. \n Que tengas un excelente dia! \n
        VALORAMOS TU OPINIÓN\n
        ¿Cuánto te gusta ${ownerName} ?¡Agréganos a Facebook y déjanos tu opinión!(Link a Facebook: ${ownerFacebookPage})\n

        SE PARTE DE LA COMUNIDAD GT\n
Registrate en nuestra web ${ownerSite} y aprovechá nuestros descuentos exclusivos on line.\n

Gracias por confiar en nosotros.\n

        ${ownerName} \n
El mejor servicio, en menor tiempo, al mejor precio.\n

${ownerFormalName}\n
${ownerSite}\n
${ownerFacebookReviewsPage}\n
${ownerEmail}\n
${ownerDescription}\n
Dirección: ${ownerAddress}\n
    Horarios de atención: ${ownerAttentionSchedule}`
}