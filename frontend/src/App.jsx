import { BrowserRouter, Routes, Route } from "react-router-dom";

import Inicio from "./pages/Inicio";
import NuevaVenta from "./pages/NuevaVenta";
import NuevoGasto from "./pages/NuevoGasto";
import Historial from "./pages/Historial";
import Editar from "./pages/Editar";
import ResultadoMes from "./pages/ResultadoMes";
import Estadisticas from "./pages/Estadisticas";
import Meses from "./pages/Meses";


function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route 
                    path="/" 
                    element={<Inicio />} 
                />

                <Route 
                    path="/nueva-venta" 
                    element={<NuevaVenta />} 
                />

                <Route 
                    path="/nuevo-gasto" 
                    element={<NuevoGasto />} 
                />

                <Route 
                    path="/historial" 
                    element={<Historial />} 
                />

                <Route 
                    path="/editar/:tipo/:id" 
                    element={<Editar />} 
                />

                <Route 
                    path="/estadisticas" 
                    element={<Estadisticas />} 
                />

                <Route 
                    path="/meses" 
                    element={<Meses />} 
                />

                <Route 
 path="/consulta-mes/:mes/:anio" 
 element={<ResultadoMes />} 
/>

                {/* prueba temporal para evitar pantalla blanca */}
                <Route 
                    path="*" 
                    element={<ResultadoMes />} 
                />

            </Routes>

        </BrowserRouter>

    );

}

export default App;