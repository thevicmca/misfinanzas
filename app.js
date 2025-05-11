// app.js

const form = document.getElementById('form-transaccion');
const lista = document.getElementById('lista-transacciones');
const totalIngresosEl = document.getElementById('total-ingresos');
const totalEgresosEl = document.getElementById('total-egresos');
const saldoEl = document.getElementById('saldo');
const graficaCanvas = document.getElementById('graficaEgresos');

let transacciones = JSON.parse(localStorage.getItem('transacciones')) || [];

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const monto = parseFloat(document.getElementById('monto').value);
  const descripcion = document.getElementById('descripcion').value;
  const categoria = document.getElementById('categoria').value;
  const tipo = document.getElementById('tipo').value;

  if (isNaN(monto) || monto <= 0) return alert('Ingrese un monto válido');

  const transaccion = {
    id: Date.now(),
    monto,
    descripcion,
    categoria,
    tipo,
    fecha: new Date().toLocaleDateString('es-HN')
  };

  transacciones.push(transaccion);
  localStorage.setItem('transacciones', JSON.stringify(transacciones));
  form.reset();
  render();
});

function render() {
  lista.innerHTML = '';
  let ingresos = 0;
  let egresos = 0;
  const egresosPorCategoria = {};

  transacciones.forEach(t => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${t.descripcion} - L. ${t.monto.toFixed(2)} (${t.categoria})</span> <button onclick="eliminar(${t.id})">❌</button>`;
    lista.appendChild(li);

    if (t.tipo === 'ingreso') {
      ingresos += t.monto;
    } else {
      egresos += t.monto;
      egresosPorCategoria[t.categoria] = (egresosPorCategoria[t.categoria] || 0) + t.monto;
    }
  });

  totalIngresosEl.textContent = ingresos.toFixed(2);
  totalEgresosEl.textContent = egresos.toFixed(2);
  saldoEl.textContent = (ingresos - egresos).toFixed(2);

  renderGrafica(egresosPorCategoria);
}

function eliminar(id) {
  transacciones = transacciones.filter(t => t.id !== id);
  localStorage.setItem('transacciones', JSON.stringify(transacciones));
  render();
}

let chart;
function renderGrafica(data) {
  const categorias = Object.keys(data);
  const valores = Object.values(data);

  if (chart) chart.destroy();

  chart = new Chart(graficaCanvas, {
    type: 'doughnut',
    data: {
      labels: categorias,
      datasets: [{
        label: 'Egresos',
        data: valores,
        backgroundColor: [
          '#f94144', '#f3722c', '#f9c74f', '#90be6d', '#43aa8b', '#577590'
        ]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: 'white'
          }
        }
      }
    }
  });
}

render();
