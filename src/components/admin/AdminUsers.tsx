
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { addAdmin } from "@/utils/authUtils";
import { UserPlus, Shield, Search } from "lucide-react";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  balance: number | null;
  isAdmin: boolean;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [addingAdmin, setAddingAdmin] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      // First get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');
      
      if (profilesError) throw profilesError;
      
      // Now get all admins from user_roles
      const { data: admins, error: adminsError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'admin');
      
      if (adminsError) throw adminsError;
      
      // Create a set of admin user IDs for easy lookup
      const adminSet = new Set((admins || []).map(admin => admin.user_id));
      
      // Combine data
      const userList = (profiles || []).map(profile => ({
        id: profile.id,
        name: profile.name,
        email: profile.email,
        balance: profile.balance,
        isAdmin: adminSet.has(profile.id)
      }));
      
      setUsers(userList);
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: "Error",
        description: "Failed to load users. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMakeAdmin = async (userId: string) => {
    try {
      setAddingAdmin(true);
      const success = await addAdmin(userId);
      
      if (!success) throw new Error("Failed to add admin");
      
      toast({
        title: "Success",
        description: "User has been made an admin.",
      });
      
      // Refresh users
      await loadUsers();
    } catch (error) {
      console.error('Error making user an admin:', error);
      toast({
        title: "Error",
        description: "Failed to make user an admin. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAddingAdmin(false);
    }
  };

  const filteredUsers = users.filter(user => 
    (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
     user.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Manage Users</h2>
      
      {/* Search */}
      <div className="relative max-w-sm mb-6">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8"
        />
      </div>
      
      {/* Users Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <div className="flex justify-center">
                    <div className="w-6 h-6 border-2 border-bet-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <TableRow key={user.id}>
                  <TableCell>{user.name || 'Anonymous'}</TableCell>
                  <TableCell>{user.email || 'No email'}</TableCell>
                  <TableCell>{user.balance !== null ? `${user.balance.toLocaleString()} RWF` : 'N/A'}</TableCell>
                  <TableCell>
                    {user.isAdmin ? (
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 text-bet-primary mr-1" />
                        <span>Admin</span>
                      </div>
                    ) : (
                      'User'
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {!user.isAdmin && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleMakeAdmin(user.id)}
                        disabled={addingAdmin}
                      >
                        <UserPlus className="h-4 w-4 mr-1" />
                        Make Admin
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">No users found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
