import { useSeoMeta } from '@unhead/react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useLoginActions } from '@/hooks/useLoginActions';
import { EditProfileForm } from '@/components/EditProfileForm';
import { ArrowRight } from 'lucide-react';

const Profile = () => {
  useSeoMeta({
    title: 'Profile - HABO',
    description: 'Manage your HABO profile and settings.',
  });

  const { user } = useCurrentUser();
  const navigate = useNavigate();
  const { logout } = useLoginActions();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <nav className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <button onClick={() => navigate('/')} className="flex items-center gap-2">
                <div className="text-2xl font-black text-white tracking-tighter">HABO</div>
                <span className="text-xs text-amber-500 font-semibold">BITCOIN SOURCES</span>
              </button>
            </div>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Sign In Required</h1>
          <p className="text-slate-300 mb-8">You need to be logged in to view your profile.</p>
          <Button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-3 font-semibold rounded-lg"
          >
            Back to Home
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button onClick={() => navigate('/')} className="flex items-center gap-2">
              <div className="text-2xl font-black text-white tracking-tighter">HABO</div>
              <span className="text-xs text-amber-500 font-semibold">BITCOIN SOURCES</span>
            </button>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/queries')}
                className="text-slate-300 hover:text-white transition-colors font-medium text-sm"
              >
                Queries
              </button>
              <button
                onClick={() => navigate('/sources')}
                className="text-slate-300 hover:text-white transition-colors font-medium text-sm"
              >
                Sources
              </button>
              <button
                onClick={() => logout()}
                className="text-slate-300 hover:text-white transition-colors font-medium text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Your Profile</h1>
          <p className="text-slate-400">Manage your Nostr profile and settings</p>
        </div>

        <div className="space-y-8">
          {/* Edit Profile */}
          <Card className="border-slate-800 bg-slate-900/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-white">Edit Profile</CardTitle>
              <CardDescription>
                Update your profile information that appears on HABO and the Nostr network
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EditProfileForm />
            </CardContent>
          </Card>

          {/* Account Info */}
          <Card className="border-slate-800 bg-slate-900/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-white">Account Information</CardTitle>
              <CardDescription>Your Nostr account details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Public Key (npub)</p>
                  <p className="text-white font-mono text-sm break-all">{user.npub}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">Public Key (Hex)</p>
                  <p className="text-white font-mono text-sm break-all">{user.pubkey}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-900/50 bg-red-950/20 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-red-400">Danger Zone</CardTitle>
              <CardDescription className="text-slate-400">
                Permanent actions that cannot be undone
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => logout()}
                variant="outline"
                className="border-red-600 text-red-400 hover:bg-red-950 hover:text-red-300"
              >
                Logout
              </Button>
              <p className="text-xs text-slate-500 mt-4">
                You will need to log in again the next time you visit HABO.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
