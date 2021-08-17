
const mongoose = require('mongoose');

const IndicadoresSchema = mongoose.Schema({

    /* unidad: String, */
    unidad: {
        type: mongoose.Types.ObjectId, ref: 'Unidades'
    },
    /* responde: String, */
    responde: {
        type: mongoose.Types.ObjectId, ref: 'Responsable'
    },
    evaluacion: String,
    /* macroProceso: String, */
    macroProceso: {
        type: mongoose.Types.ObjectId, ref: 'MacroProcesos'
    },
    producto: String,
    indicador: String,
    formula: String,
    descripcion: String,
    responsable: String,
    nombreResponsable: String,
    fechaMedicion: String,
    lineaBase: String,
    comportamiento: String,
    unidadMedida: String,
    sentidoMedicion: String,
    meta: String,

    enero: String,
    febrero: String,
    marzo: String,
    abril: String,
    mayo: String,
    junio: String,
    julio: String,
    agosto: String,
    septiembre: String,
    octubre: String,
    noviembre: String,
    diciembre: String,
    trimestre1: String,
    trimestre2: String,
    trimestre3: String,
    trimestre4: String,
    cuatrimestral1: String,
    cuatrimestral2: String,
    cuatrimestral3: String,
    semestral1: String,
    semestral2: String,
    anual: String,
    observaciones: String,
    periodicidad: String,

    /* Avance Indicadores*/
    periods: Array,
    resultYear: [{
        result: String,
        compliance: String,
        class: String,
        color: String,
        enabled: Boolean
    }],
    solicitaAvanceIndicador: String,

    solicitaUpd: String,
    autorizacion: String,

    fechaReporte: { type: Date, required: true, default: Date.now },
    usuario: {
        type: mongoose.Types.ObjectId, ref: 'Usuario'
    },

})

module.exports = mongoose.model('Indicadores', IndicadoresSchema);

