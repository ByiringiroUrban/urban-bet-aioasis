
import { Link } from "react-router-dom";
import { Zap, ShieldCheck, CreditCard, Heart, Twitter, Facebook, Instagram, Youtube } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  return (
    <footer className="bg-bet-dark-accent py-12 mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center">
              <div className="w-8 h-8 rounded-md bg-gradient-to-br from-bet-primary to-bet-accent flex items-center justify-center mr-2">
                <Zap size={18} className="text-white" />
              </div>
              <span className="text-2xl font-bold gradient-text">UrbanBet</span>
            </Link>
            
            <p className="mt-4 text-sm text-gray-400">
              Urban Bet is a premium online betting platform offering sports betting, casino games, and advanced AI-powered predictions.
            </p>
            
            <div className="mt-6 flex space-x-4">
              <a href="https://twitter.com/UrbanBet" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-bet-primary transition-colors">
                <Twitter size={20} />
              </a>
              <a href="https://facebook.com/UrbanBet" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-bet-primary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://instagram.com/UrbanBet" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-bet-primary transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://youtube.com/UrbanBet" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-bet-primary transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Sports</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/sports/football" className="text-gray-400 hover:text-bet-primary transition-colors">Football</Link></li>
              <li><Link to="/sports/basketball" className="text-gray-400 hover:text-bet-primary transition-colors">Basketball</Link></li>
              <li><Link to="/sports/tennis" className="text-gray-400 hover:text-bet-primary transition-colors">Tennis</Link></li>
              <li><Link to="/sports/esports" className="text-gray-400 hover:text-bet-primary transition-colors">Esports</Link></li>
              <li><Link to="/sports/all" className="text-gray-400 hover:text-bet-primary transition-colors">All Sports</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Casino</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/casino/slots" className="text-gray-400 hover:text-bet-primary transition-colors">Slots</Link></li>
              <li><Link to="/casino/table-games" className="text-gray-400 hover:text-bet-primary transition-colors">Table Games</Link></li>
              <li><Link to="/casino/live-casino" className="text-gray-400 hover:text-bet-primary transition-colors">Live Casino</Link></li>
              <li><Link to="/casino/jackpots" className="text-gray-400 hover:text-bet-primary transition-colors">Jackpots</Link></li>
              <li><Link to="/casino/game-shows" className="text-gray-400 hover:text-bet-primary transition-colors">Game Shows</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Help & Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/responsible-gambling" className="text-gray-400 hover:text-bet-primary transition-colors">Responsible Gambling</Link></li>
              <li><Link to="/faq" className="text-gray-400 hover:text-bet-primary transition-colors">FAQ</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-bet-primary transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="text-gray-400 hover:text-bet-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-bet-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        
        <Separator className="my-8 bg-gray-700" />
        
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-4 md:mb-0">
            <div className="flex items-center text-sm text-gray-400">
              <ShieldCheck size={18} className="mr-1 text-bet-primary" />
              Secure Payments
            </div>
            <div className="flex items-center text-sm text-gray-400">
              <CreditCard size={18} className="mr-1 text-bet-primary" />
              Fast Withdrawals
            </div>
            <div className="flex items-center text-sm text-gray-400">
              <Heart size={18} className="mr-1 text-bet-primary" />
              Responsible Gambling
            </div>
          </div>
          
          <div className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Urban Bet. All rights reserved.
          </div>
        </div>
        
        <div className="mt-6 text-xs text-center text-gray-600">
          18+ Gamble Responsibly. Urban Bet promotes responsible gambling. Please be aware that gambling is a form of entertainment and not a way to make money. Never gamble with money you cannot afford to lose.
        </div>
      </div>
    </footer>
  );
}
