
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Brain, Zap, Trophy, ArrowRight } from "lucide-react";

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      title: "AI-Powered Betting",
      subtitle: "Make smarter predictions with our advanced AI analysis",
      cta: "Explore AI Predictions",
      link: "/ai-predictions",
      image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1600&auto=format&fit=crop",
      icon: <Brain size={24} className="mr-2" />
    },
    {
      title: "Live Sports Betting",
      subtitle: "Bet in real-time with instant updates and dynamic odds",
      cta: "Bet Live Now",
      link: "/live",
      image: "https://images.unsplash.com/photo-1508098682722-e99c643e7f0b?q=80&w=1600&auto=format&fit=crop",
      icon: <Zap size={24} className="mr-2" />
    },
    {
      title: "Casino Games",
      subtitle: "Experience the thrill of premium casino games and slots",
      cta: "Play Casino",
      link: "/casino",
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1600&auto=format&fit=crop",
      icon: <Trophy size={24} className="mr-2" />
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="relative h-[500px] md:h-[600px] w-full overflow-hidden">
      {/* Background Images with Fade Transition */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{
            opacity: currentSlide === index ? 1 : 0,
            backgroundImage: `linear-gradient(to bottom, rgba(17, 24, 39, 0.7), rgba(17, 24, 39, 0.9)), url(${slide.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            zIndex: currentSlide === index ? 1 : 0
          }}
        />
      ))}
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center">
        <div className="max-w-4xl animate-float">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 gradient-text">
            {slides[currentSlide].title}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/80">
            {slides[currentSlide].subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-bet-primary hover:bg-bet-primary/90 group"
              asChild
            >
              <Link to={slides[currentSlide].link}>
                {slides[currentSlide].icon}
                {slides[currentSlide].cta}
                <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-white/20 hover:bg-white/10"
              asChild
            >
              <Link to="/register">
                Sign Up Now
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Dots Indicator */}
        <div className="absolute bottom-8 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all ${
                currentSlide === index
                  ? "bg-bet-primary w-6"
                  : "bg-white/30 hover:bg-white/50"
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
