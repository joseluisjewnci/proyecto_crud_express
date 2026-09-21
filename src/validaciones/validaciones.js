function validarNombre(nombre) {
    const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,}$/;
    return regex.test(nombre);
}

function validarCorreo(correo) {
    const regex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return regex.test(correo);
}

module.exports = {
    validarNombre,
    validarCorreo
};