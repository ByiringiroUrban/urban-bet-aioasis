
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Ticket, Search, ChevronDown, ChevronUp } from "lucide-react";
import { BetRecord } from "@/services/database/types";

export default function AdminBets() {
  const [bets, setBets] = useState<BetRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expandedBet, setExpandedBet] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadBets();
  }, []);

  const loadBets = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bets')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Format bets data
      const formattedBets = (data || []).map(bet => ({
        id: bet.id,
        userId: bet.user_id,
        items: bet.items as {
          event: string;
          selection: string;
          odds: number;
        }[],
        totalOdds: bet.total_odds,
        amount: bet.amount,
        potentialWinnings: bet.potential_winnings,
        timestamp: bet.created_at,
        status: bet.status as 'pending' | 'won' | 'lost' | 'cancelled',
        currency: bet.currency as 'USD' | 'RWF'
      }));
      
      setBets(formattedBets);
    } catch (error) {
      console.error('Error loading bets:', error);
      toast({
        title: "Error",
        description: "Failed to load bets. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleExpandBet = (betId: string) => {
    if (expandedBet === betId) {
      setExpandedBet(null);
    } else {
      setExpandedBet(betId);
    }
  };

  const filteredBets = bets.filter(bet => {
    // Apply status filter
    if (statusFilter !== "all" && bet.status !== statusFilter) {
      return false;
    }
    
    // Apply search filter
    return (
      bet.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bet.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bet.items.some(item => 
        item.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.selection.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'won':
        return "success";
      case 'lost':
        return "destructive";
      case 'cancelled':
        return "outline";
      default:
        return "default";
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Bet History</h2>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search bets"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        
        {/* Status Filter */}
        <div className="w-full sm:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="won">Won</SelectItem>
              <SelectItem value="lost">Lost</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Bets Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bet ID</TableHead>
              <TableHead>User ID</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Total Odds</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex justify-center">
                    <div className="w-6 h-6 border-2 border-bet-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredBets.length > 0 ? (
              filteredBets.map(bet => (
                <React.Fragment key={bet.id}>
                  <TableRow className="cursor-pointer hover:bg-accent/50" onClick={() => toggleExpandBet(bet.id)}>
                    <TableCell>
                      <div className="flex items-center">
                        <Ticket className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{bet.id.substring(0, 8)}...</span>
                      </div>
                    </TableCell>
                    <TableCell>{bet.userId.substring(0, 8)}...</TableCell>
                    <TableCell>{bet.amount.toLocaleString()} {bet.currency}</TableCell>
                    <TableCell>{bet.totalOdds.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(bet.status)}>
                        {bet.status.charAt(0).toUpperCase() + bet.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(bet.timestamp).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      {expandedBet === bet.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </TableCell>
                  </TableRow>
                  
                  {/* Expanded Bet Details */}
                  {expandedBet === bet.id && (
                    <TableRow>
                      <TableCell colSpan={7} className="bg-accent/10 p-4">
                        <div className="space-y-3">
                          <h4 className="text-sm font-semibold">Bet Details</h4>
                          <div className="rounded-md border border-border">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Event</TableHead>
                                  <TableHead>Selection</TableHead>
                                  <TableHead>Odds</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {bet.items.map((item, idx) => (
                                  <TableRow key={idx}>
                                    <TableCell>{item.event}</TableCell>
                                    <TableCell>{item.selection}</TableCell>
                                    <TableCell>{item.odds.toFixed(2)}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Bet Amount</p>
                              <p className="font-medium">{bet.amount.toLocaleString()} {bet.currency}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Potential Winnings</p>
                              <p className="font-medium">{bet.potentialWinnings.toLocaleString()} {bet.currency}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Bet Time</p>
                              <p className="font-medium">{new Date(bet.timestamp).toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6">No bets found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
