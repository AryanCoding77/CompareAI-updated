
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleUpdateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      
      if (!response.ok) throw new Error('Failed to update account');
      setSuccess('Account updated successfully');
      setError('');
    } catch (err) {
      setError('Failed to update account');
      setSuccess('');
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch('/api/user/delete', {
        method: 'POST',
      });
      
      if (!response.ok) throw new Error('Failed to delete account');
      await fetch('/api/logout', { method: 'POST' });
      navigate('/');
    } catch (err) {
      setError('Failed to delete account');
    }
  };

  return (
    <div className="container max-w-2xl py-8">
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
      
      <Tabs defaultValue="edit">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="edit" className="flex-1">Edit Account</TabsTrigger>
          <TabsTrigger value="delete" className="flex-1">Delete Account</TabsTrigger>
        </TabsList>

        <TabsContent value="edit">
          <form onSubmit={handleUpdateAccount} className="space-y-4">
            <div>
              <label className="block mb-2">New Username</label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter new username"
              />
            </div>
            <div>
              <label className="block mb-2">New Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>
            <Button type="submit">Update Account</Button>
          </form>
        </TabsContent>

        <TabsContent value="delete">
          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription>
                Warning: This action cannot be undone. All your data will be permanently deleted.
              </AlertDescription>
            </Alert>
            <Button variant="destructive" onClick={handleDeleteAccount}>
              Delete Account
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert className="mt-4">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
