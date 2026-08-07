let ventas = [];

export function obtenerVentas() {
  return ventas;
}

export function guardarVenta(venta) {
  ventas.push(venta);
}

export function totalVentasHoy() {

  const hoy = new Date().toLocaleDateString("es-CO");

  return ventas
    .filter(v => v.fecha === hoy)
    .reduce((total, v) => total + Number(v.valor), 0);

}