import { useSeoMeta } from '@unhead/react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { HABOLoginArea } from '@/components/HABOLoginArea';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { ArrowRight, Zap, Users, Lightbulb } from 'lucide-react';

const Index = () => {
  useSeoMeta({
    title: 'HABO - Help a Bitcoiner Out',
    description: 'Connect journalists, reporters, and content creators in the Bitcoin space with expert sources. Publish queries and find sources on Nostr.',
  });

  const { user } = useCurrentUser();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="text-2xl font-black text-white tracking-tighter">
                HABO
              </div>
              <span className="text-xs text-amber-500 font-semibold">BITCOIN SOURCES</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/queries')}
                className="text-slate-300 hover:text-white transition-colors font-medium text-sm"
              >
                Opportunities
              </button>
              <button
                onClick={() => navigate('/sources')}
                className="text-slate-300 hover:text-white transition-colors font-medium text-sm"
              >
                Expertise
              </button>
              <HABOLoginArea className="max-w-xs" />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-amber-500/10 via-transparent to-transparent rounded-full blur-3xl" />
          <div className="absolute -bottom-1/2 -left-1/4 w-2/3 h-2/3 bg-gradient-to-tr from-orange-500/10 via-transparent to-transparent rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight tracking-tight">
            Bitcoin Content <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Marketplace</span>
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Post opportunities. Offer expertise. Connect with collaborators. A peer-to-peer marketplace for Bitcoin content creators built on Nostr.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            {user ? (
              <>
                <Button
                  onClick={() => navigate('/queries')}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-6 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Browse Opportunities
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  onClick={() => navigate('/profile')}
                  variant="outline"
                  className="border-slate-600 hover:bg-slate-800 text-white px-8 py-6 text-lg font-semibold rounded-lg"
                >
                  Your Profile
                </Button>
              </>
            ) : (
              <Button
                onClick={() => {}}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-6 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                Join the Marketplace
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            )}
          </div>

          <p className="text-slate-400 text-sm">
            {user ? (
              <>
                Ready to share your expertise? <button onClick={() => navigate('/sources')} className="text-amber-400 hover:text-amber-300 font-semibold">Post Your Expertise →</button>
              </>
            ) : (
              <>
                Login with Nostr to post opportunities and offer your expertise
              </>
            )}
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1: Post Opportunities */}
          <Card className="border-slate-800 bg-slate-900/50 backdrop-blur hover:border-amber-500/50 transition-all hover:shadow-lg hover:shadow-amber-500/10">
            <CardContent className="p-8">
              <div className="mb-4 p-3 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-lg w-fit">
                <Zap className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Post Opportunities</h3>
              <p className="text-slate-400">
                Publish what you're seeking: interview guests, podcast contributors, research partners, or article sources. Reach Bitcoin experts directly.
              </p>
            </CardContent>
          </Card>

          {/* Feature 2: Offer Expertise */}
          <Card className="border-slate-800 bg-slate-900/50 backdrop-blur hover:border-amber-500/50 transition-all hover:shadow-lg hover:shadow-amber-500/10">
            <CardContent className="p-8">
              <div className="mb-4 p-3 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-lg w-fit">
                <Users className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Offer Your Expertise</h3>
              <p className="text-slate-400">
                Register your knowledge in development, economics, mining, regulations, and more. Get discovered by journalists and content creators.
              </p>
            </CardContent>
          </Card>

          {/* Feature 3: Powered by Nostr & NIP-99 */}
          <Card className="border-slate-800 bg-slate-900/50 backdrop-blur hover:border-amber-500/50 transition-all hover:shadow-lg hover:shadow-amber-500/10">
            <CardContent className="p-8">
              <div className="mb-4 p-3 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-lg w-fit">
                <Lightbulb className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Built on Open Standards</h3>
              <p className="text-slate-400">
                Powered by Nostr and NIP-99. No corporate gatekeepers. Fully peer-to-peer. Your listings are yours to control.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="border-amber-500/50 bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-xl">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Start Collaborating Today</h2>
            <p className="text-slate-300 mb-8">
              Whether you're posting an opportunity or offering your expertise, HABO is the Bitcoin content creator marketplace built on Nostr.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate('/queries')}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-3 font-semibold rounded-lg"
              >
                Browse Opportunities
              </Button>
              <Button
                onClick={() => navigate('/sources')}
                variant="outline"
                className="border-slate-400 hover:bg-slate-800 text-white px-8 py-3 font-semibold rounded-lg"
              >
                Find Experts
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950/50 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="text-2xl font-black text-white">HABO</div>
              <span className="text-xs text-amber-500 font-semibold">BITCOIN SOURCES</span>
            </div>
            <div className="flex gap-8 text-sm text-slate-400">
              <button onClick={() => navigate('/queries')} className="hover:text-white transition-colors">Opportunities</button>
              <button onClick={() => navigate('/sources')} className="hover:text-white transition-colors">Expertise</button>
              <a href="https://shakespeare.diy" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Vibed with Shakespeare</a>
            </div>
            <div className="text-xs text-slate-500">
              © 2025 HABO - Bitcoin Content Creator Network
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
