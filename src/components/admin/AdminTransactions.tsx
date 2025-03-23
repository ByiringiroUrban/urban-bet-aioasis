
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { ArrowUpRight, ArrowDownRight, Search, CreditCard, Plus } from "lucide-react";

interface Transaction {
  id: string;
  userId: string;
  type: 'deposit' | 'withdrawal' | 'bet_win' | 'bet_loss';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
  method?: string;
  reference?: string;
}

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    loadTransactions();
  }, []);

  // Mock transaction data - In a real app, this would come from Supabase
  const mockTransactions: Transaction[] = [
    {
      id: "tx-" + Math.random().toString(36).substring(2, 10),
      userId: "user-" + Math.random().toString(36).substring(2, 10),
      type: "deposit",
      amount: 50000,
      currency: "RWF",
      status: "completed",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      method: "Mobile Money",
      reference: "MM-" + Math.random().toString(36).substring(2, 10)
    },
    {
      id: "tx-" + Math.random().toString(36).substring(2, 10),
      userId: "user-" + Math.random().toString(36).substring(2, 10),
      type: "withdrawal",
      amount: 25000,
      currency: "RWF",
      status: "pending",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      method: "Bank Transfer",
      reference: "BT-" + Math.random().toString(36).substring(2, 10)
    },
    {
      id: "tx-" + Math.random().toString(36).substring(2, 10),
      userId: "user-" + Math.random().toString(36).substring(2, 10),
      type: "bet_win",
      amount: 75000,
      currency: "RWF",
      status: "completed",
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "tx-" + Math.random().toString(36).substring(2, 10),
      userId: "user-" + Math.random().toString(36).substring(2, 10),
      type: "bet_loss",
      amount: 30000,
      currency: "RWF",
      status: "completed",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "tx-" + Math.random().toString(36).substring(2, 10),
      userId: "user-" + Math.random().toString(36).substring(2, 10),
      type: "deposit",
      amount: 100000,
      currency: "RWF",
      status: "failed",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      method: "Credit Card",
      reference: "CC-" + Math.random().toString(36).substring(2, 10)
    }
  ];

  const loadTransactions = async () => {
    setLoading(true);
    try {
      // In a real implementation, you would fetch from Supabase
      // For now, we'll use mock data with a delay to simulate network request
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setTransactions(mockTransactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
      toast({
        title: "Error",
        description: "Failed to load transactions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const approveTransaction = (id: string) => {
    // In a real app, this would update the transaction status in the database
    toast({
      title: "Transaction Approved",
      description: `Transaction ${id.substring(0, 8)} has been approved.`,
    });
    
    // Update local state to reflect the change
    setTransactions(prev => 
      prev.map(tx => 
        tx.id === id ? { ...tx, status: 'completed' } : tx
      )
    );
  };

  const rejectTransaction = (id: string) => {
    // In a real app, this would update the transaction status in the database
    toast({
      title: "Transaction Rejected",
      description: `Transaction ${id.substring(0, 8)} has been rejected.`,
      variant: "destructive",
    });
    
    // Update local state to reflect the change
    setTransactions(prev => 
      prev.map(tx => 
        tx.id === id ? { ...tx, status: 'failed' } : tx
      )
    );
  };

  const filteredTransactions = transactions.filter(tx => {
    // Apply type filter
    if (typeFilter !== "all" && tx.type !== typeFilter) {
      return false;
    }
    
    // Apply status filter
    if (statusFilter !== "all" && tx.status !== statusFilter) {
      return false;
    }
    
    // Apply search filter (user ID, transaction ID, or reference)
    if (searchTerm) {
      return (
        tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tx.reference && tx.reference.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    return true;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return "secondary";
      case 'failed':
        return "destructive";
      default:
        return "default";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowUpRight className="h-4 w-4 text-green-500" />;
      case 'withdrawal':
        return <ArrowDownRight className="h-4 w-4 text-red-500" />;
      case 'bet_win':
        return <ArrowUpRight className="h-4 w-4 text-green-500" />;
      case 'bet_loss':
        return <ArrowDownRight className="h-4 w-4 text-red-500" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Transaction History</h2>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by ID or reference"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        
        {/* Type Filter */}
        <div className="w-full sm:w-auto">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="deposit">Deposits</SelectItem>
              <SelectItem value="withdrawal">Withdrawals</SelectItem>
              <SelectItem value="bet_win">Bet Wins</SelectItem>
              <SelectItem value="bet_loss">Bet Losses</SelectItem>
            </SelectContent>
          </Select>
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
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Transactions Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>User ID</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <div className="flex justify-center">
                    <div className="w-6 h-6 border-2 border-bet-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredTransactions.length > 0 ? (
              filteredTransactions.map(transaction => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <div className="flex items-center">
                      {getTypeIcon(transaction.type)}
                      <span className="ml-2 capitalize">
                        {transaction.type === 'bet_win' ? 'Bet Win' : 
                         transaction.type === 'bet_loss' ? 'Bet Loss' : 
                         transaction.type}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{transaction.userId.substring(0, 8)}...</TableCell>
                  <TableCell>
                    <span className={transaction.type === 'deposit' || transaction.type === 'bet_win' ? 'text-green-500 font-medium' : 
                      transaction.type === 'withdrawal' || transaction.type === 'bet_loss' ? 'text-red-500 font-medium' : ''}>
                      {transaction.type === 'deposit' || transaction.type === 'bet_win' ? '+' : '-'}
                      {transaction.amount.toLocaleString()} {transaction.currency}
                    </span>
                  </TableCell>
                  <TableCell>{transaction.method || 'N/A'}</TableCell>
                  <TableCell>{transaction.reference || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(transaction.status)}>
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(transaction.timestamp).toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    {transaction.status === 'pending' && (
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => approveTransaction(transaction.id)}
                          className="border-green-500 hover:bg-green-500 hover:text-white"
                        >
                          Approve
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => rejectTransaction(transaction.id)}
                          className="border-red-500 hover:bg-red-500 hover:text-white"
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6">No transactions found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
