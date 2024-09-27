function generarMensajeAdvertencia(periodo, glucosa, tipo) {
    const mensajeTipo = tipo === 'HIPERGLUCEMIA' ? 'superior a 200 mg/dL' : 'inferior a 50 mg/dL';
    return `¡ADVERTENCIA!: Su valor de glucosa ${periodo + " -"} ${glucosa} mg/dL, es ${mensajeTipo} lo que supone una ${tipo}. Se sugiere CONSULTA INMEDIATA.`;
}

function verificarValor(glucosa, periodo) {
    if (glucosa > 200) {
        return generarMensajeAdvertencia(periodo, glucosa, 'HIPERGLUCEMIA');
    } else if (glucosa < 50) {
        return generarMensajeAdvertencia(periodo, glucosa, 'HIPOGLUCEMIA');
    }
    return null;
}

function redirigir() {
    window.location.href = "../index.html";
}

function validarLectura(glucosa, periodo) {
    if (isNaN(glucosa)) {
        return `El valor de glucosa en el campo ${periodo + " -"} es requerido y debe ser un número.`;
    }
    if (glucosa < 20 || glucosa > 300) {
        return `El valor de glucosa en el campo ${periodo + " -"} debe estar entre 20 y 300 mg/dL.`;
    }
    return null;
}

function calcularInsulina() {
    const periodos = ['Ayunas', 'PreColacion', 'PostAlmuerzo', 'Merienda'];
    const valoresGlucosa = [];
    let alertas = [];
    let tieneErrores = false;

    for (let i = 0; i < periodos.length; i++) {
        const periodo = periodos[i];
        const glucosa = parseFloat(document.getElementById(`glucosa${periodo}`).value);
        valoresGlucosa[i] = glucosa;

        const validacion = validarLectura(glucosa, periodo);
        if (validacion) {
            alertas.push(validacion);
            tieneErrores = true;
        } else {
            const resultado = verificarValor(glucosa, periodo);
            if (resultado) alertas.push(resultado);
        }
    }

    if (tieneErrores) {
        alert(alertas.join('\n'));
        return;
    }

    const objetivoGlucosa = 120;
    const factorCorreccion = 50;
    let insulinaTotal = 0;
    const dosisInsulina = [];

    for (let i = 0; i < valoresGlucosa.length; i++) {
        const diferencia = valoresGlucosa[i] - objetivoGlucosa;
        const dosis = diferencia > 0 ? diferencia / factorCorreccion : 0;
        dosisInsulina[i] = dosis;
        insulinaTotal += dosis;
    }

    let resultadoParaHTML = '<p>Insulina necesaria:</p><ul>';
    for (let i = 0; i < periodos.length; i++) {
        resultadoParaHTML += `<li>${periodos[i]}: ${dosisInsulina[i].toFixed(2)} unidades</li>`;
    }
    resultadoParaHTML += `<li><strong>Total diaria: ${insulinaTotal.toFixed(2)} unidades</strong></li></ul>`;
    
    document.getElementById('resultado').innerHTML = resultadoParaHTML;

    if (alertas.length > 0) {
        alert(alertas.join('\n'));
    }
}

function reiniciarFormulario() {
    const periodos = ['Ayunas', 'PreColacion', 'PostAlmuerzo', 'Merienda'];
    for (let i = 0; i < periodos.length; i++) {
        document.getElementById(`glucosa${periodos[i]}`).value = '';
    }
    document.getElementById('resultado').innerHTML = '';
}
function generarNumeroAleatorio() {
    return Math.floor(Math.random() * 36) + 1;
};
const numeroAleatorio = generarNumeroAleatorio();
console.log(numeroAleatorio);

function formatearFecha(fecha) {
    const dias = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
    const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
    
    const diaSemana = dias[fecha.getDay()];
    const dia = fecha.getDate();
    const mes = meses[fecha.getMonth()];
    const año = fecha.getFullYear();
    
    return `${diaSemana} ${dia} de ${mes} de ${año}`;
}


const fechaFormateada = formatearFecha(new Date);
console.log(fechaFormateada);
