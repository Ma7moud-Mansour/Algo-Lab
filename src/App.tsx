import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import Home from "./pages/Home";
import AlgorithmVisualizer from "./pages/AlgorithmVisualizer";
import AlgorithmsDirectory from "./pages/AlgorithmsDirectory";
import Docs from "./pages/Docs";
import NotFound from "./pages/NotFound";
import AlgorithmBattle from "./pages/AlgorithmBattle";
import LearningTest from "./pages/LearningTest";
import AlgorithmDecision from "./pages/AlgorithmDecision";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/algorithms" element={<AlgorithmsDirectory />} />
            <Route path="/algorithms/:category" element={<AlgorithmsDirectory />} />
            <Route path="/algorithms/:category/:id" element={<AlgorithmVisualizer />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="/algorithm-battle" element={<AlgorithmBattle />} />
            <Route path="/learning-test" element={<LearningTest />} />
            <Route path="/algorithm-decision" element={<AlgorithmDecision />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
