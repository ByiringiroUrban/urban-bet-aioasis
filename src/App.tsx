
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BettingProvider } from "@/contexts/BettingContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AIPredictions from "./pages/AIPredictions";
import Casino from "./pages/Casino";
import Sports from "./pages/Sports";
import LiveBetting from "./pages/LiveBetting";
import NotFound from "./pages/NotFound";
import Account from "./pages/Account";
import Wallet from "./pages/Wallet";
import ResponsibleGambling from "./pages/ResponsibleGambling";
import FAQ from "./pages/FAQ";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Contact from "./pages/Contact";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BettingProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/ai-predictions" element={<AIPredictions />} />
            <Route path="/casino" element={<Casino />} />
            <Route path="/sports" element={<Sports />} />
            <Route path="/sports/:sport" element={<Sports />} />
            <Route path="/sports/:sport/:country" element={<Sports />} />
            <Route path="/sports/:sport/:country/:league" element={<Sports />} />
            <Route path="/live" element={<LiveBetting />} />
            <Route path="/account" element={<Account />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/responsible-gambling" element={<ResponsibleGambling />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/contact" element={<Contact />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </BettingProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
