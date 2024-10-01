/* - - - Insulina - - - */

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

/* - - - Registro - - - */

const registros = [];
const etiquetas = [
    "Antes del desayuno", 
    "Después del desayuno", 
    "Antes del almuerzo", 
    "Después del almuerzo", 
    "Antes de la cena", 
    "Después de la cena", 
    "Antes de ir a dormir"
];

function guardarDatos() {
    const fecha = document.getElementById('fechaRegistro').innerText;    
    const diaSeleccionado = document.getElementById('diaSeleccionado').value;

    if (!fecha || !diaSeleccionado) {
        alert('Por favor, selecciona un día de la semana para tu registro.');
        return;
    }

    const formulario = document.getElementById(diaSeleccionado);
    if (!validarFormulario(formulario)) {
        return;
    }

    const niveles = Array.from(document.querySelectorAll(`#${diaSeleccionado} .glucose`))
        .map(input => parseFloat(input.value) || null);    
    registros.push({ fechaIngreso: fecha, diaRegistrado: diaSeleccionado, niveles });
    hacerOtroRegistro();
    mostrarRegistros();
    alert('Registros guardados exitosamente!!.');
}

function mostrarRegistros() {
    const registroDiario = document.getElementById("registroDiario");
    registroDiario.innerHTML = '';
    const tabla = document.createElement('table');
    const encabezados = ['Fecha Ingreso', 'Día Registrado', etiquetas[0], etiquetas[1], etiquetas[2], etiquetas[3], etiquetas[4], etiquetas[5], etiquetas[6]];
    const filaEncabezados = document.createElement('tr');
    encabezados.forEach(encabezado => {
        const th = document.createElement('th');
        th.innerText = encabezado;
        filaEncabezados.appendChild(th);
    });
    tabla.appendChild(filaEncabezados);

    registros.forEach(registro => {
        const fila = document.createElement('tr');
        
        const tdFecha = document.createElement('td');
        tdFecha.innerText = registro.fechaIngreso;
        fila.appendChild(tdFecha);

        const tdDia = document.createElement('td');
        tdDia.innerText = registro.diaRegistrado;
        fila.appendChild(tdDia);

        etiquetas.forEach((etiqueta, index) => {
            const tdNivel = document.createElement('td');
            const nivel = registro.niveles[index] !== undefined ? `${registro.niveles[index]} mg/dL` : 'N/A';
            tdNivel.innerText = nivel;
            fila.appendChild(tdNivel);
        });

        tabla.appendChild(fila);
    });
    registroDiario.appendChild(tabla);
}

function hacerOtroRegistro() {
    document.getElementById('formularios').innerHTML = '';
}

function mostrarFormulario(dia) {
    
    const formulariosDiv = document.getElementById('formularios');
    formulariosDiv.innerHTML = '';

    if (dia) {
        formulariosDiv.style.display = 'block';
        const formulario = document.createElement('div');
        formulario.className = 'formulario-dia';
        formulario.id = dia;

        const titulo = document.createElement('h3');
        titulo.textContent = dia;
        formulario.appendChild(titulo);

        etiquetas.forEach(etiqueta => {
            const label = document.createElement('label');
            label.textContent = `${etiqueta}: `;
            const input = document.createElement('input');
            input.type = 'number';
            input.id = `${etiqueta}`;
            input.step = '1';
            input.className = 'glucose';
            input.placeholder = 'valor de 20 a 300 (mg/dL)';
            input.min = 20;
            input.max = 300;
            input.required = true;
            label.appendChild(input);
            formulario.appendChild(label);
        });

        formulariosDiv.appendChild(formulario);
    } else {
        formulariosDiv.style.display = 'none';
    }
}

function validarFormulario(formulario) {
    const inputs = formulario.querySelectorAll('.glucose');
    for (const input of inputs) {
        const valor = parseFloat(input.value);
        if (isNaN(valor) || valor < 20 || valor > 300) {
            alert(`El valor "${input.id}", debe ser numérico y estar entre 20 y 300 (mg/dL).`);
            return false;
        }
    }
    return true;
}

function formatearFecha(fecha) {
    const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    
    const diaSemana = dias[fecha.getDay()];
    const dia = fecha.getDate();
    const mes = meses[fecha.getMonth()];
    const año = fecha.getFullYear();
    
    return `${diaSemana} ${dia} de ${mes} de ${año}`;
}

function mostrarFecha() {
    const fechaRegistro = document.getElementById('fechaRegistro');
    const fechaActual = new Date();
    fechaRegistro.textContent = formatearFecha(fechaActual);
}

window.onload = mostrarFecha;

