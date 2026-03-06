import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import ImageUploadPage from "@/pages/ImageUploadPage";
import NamePage from "@/pages/NamePage";
import ThemePage from "@/pages/ThemePage";
import VarietyPage from "@/pages/VarietyPage";
import OriginPage from "@/pages/OriginPage";
import LocationPage from "@/pages/LocationPage";
import PricePage from "@/pages/PricePage";
import RatingPage from "@/pages/RatingPage";
import CommentPage from "@/pages/CommentPage";
import CardPage from "@/pages/CardPage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/image" component={ImageUploadPage} />
      <Route path="/name" component={NamePage} />
      <Route path="/theme" component={ThemePage} />
      <Route path="/origin" component={OriginPage} />
      <Route path="/variety" component={VarietyPage} />
      <Route path="/location" component={LocationPage} />
      <Route path="/price" component={PricePage} />
      <Route path="/rating" component={RatingPage} />
      <Route path="/comment" component={CommentPage} />
      <Route path="/card" component={CardPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
