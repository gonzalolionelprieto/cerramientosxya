
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Dashboard from "./components/Dashboard";
import PedidosForm from "./components/PedidosForm";
import PedidosList from "./components/PedidosList";
import Instalaciones from "./components/Instalaciones";
import Logistica from "./components/Logistica";
import PanelInstalador from "./components/PanelInstalador";
import ProveedoresManager from "./components/ProveedoresManager";
import ReportesAnalisis from "./components/ReportesAnalisis";
import ConfiguracionSistema from "./components/ConfiguracionSistema";
import Fabrica from "./components/Fabrica";
import GestionProductos from "./components/GestionProductos"; // Import GestionProductos
import NotFound from "./pages/NotFound";
import CrearPresupuesto from "./pages/CrearPresupuesto";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/pedidos/nuevo" element={<CrearPresupuesto />} />
            <Route path="/pedidos" element={<PedidosList />} />
            <Route path="/instalaciones" element={<Instalaciones />} />
            <Route path="/logistica" element={<Logistica />} />
            <Route path="/instalador" element={<PanelInstalador />} />
            <Route path="/proveedores" element={<ProveedoresManager />} />
            <Route path="/reportes" element={<ReportesAnalisis />} />
            <Route path="/configuracion" element={<ConfiguracionSistema />} />
            <Route path="/fabrica" element={<Fabrica />} />
            <Route path="/productos" element={<GestionProductos />} /> {/* Add GestionProductos route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
