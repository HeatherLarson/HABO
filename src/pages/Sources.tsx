import { useSeoMeta } from '@unhead/react';
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNostr } from '@nostrify/react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { HABOLoginArea } from '@/components/HABOLoginArea';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useNostrPublish } from '@/hooks/useNostrPublish';
import { useAuthor } from '@/hooks/useAuthor';
import { Skeleton } from '@/components/ui/skeleton';
import { genUserName } from '@/lib/genUserName';
import { Search, Plus, MessageSquare, Globe, Mail } from 'lucide-react';
import type { NostrEvent } from '@nostrify/nostrify';

const Sources = () => {
  useSeoMeta({
    title: 'Expertise - HABO',
    description: 'Discover Bitcoin experts offering their knowledge. Post your expertise to help journalists and creators.',
  });

  const { user } = useCurrentUser();
  const navigate = useNavigate();
  const { nostr } = useNostr();
  const { mutate: publishEvent } = useNostrPublish();

  const [searchTerm, setSearchTerm] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    expertise: '',
    twitter: '',
    website: '',
  });
  const [selectedExpertise, setSelectedExpertise] = useState<string>('all');

  // Fetch source/expertise listings from Nostr (kind 30402 with 'source' tag)
  const { data: sources = [], isLoading, refetch } = useQuery({
    queryKey: ['sources', selectedExpertise],
    queryFn: async (c) => {
      const signal = AbortSignal.any([c.signal, AbortSignal.timeout(3000)]);
      const filter: Record<string, unknown> = {
        kinds: [30402],
        '#t': ['source', 'bitcoin'],
        limit: 100,
      };

      if (selectedExpertise !== 'all') {
        filter['#expertise'] = [selectedExpertise];
      }

      const events = await nostr.query([filter], { signal });
      return events.sort((a, b) => b.created_at - a.created_at);
    },
    staleTime: 30000,
  });

  const filteredSources = sources.filter((source) => {
    const searchLower = searchTerm.toLowerCase();
    const content = source.content.toLowerCase();
    const title = source.tags.find(([name]) => name === 'title')?.[1]?.toLowerCase() || '';
    return content.includes(searchLower) || title.includes(searchLower);
  });

  const handleSaveProfile = useCallback(() => {
    if (!user || !formData.title.trim() || !formData.content.trim() || !formData.expertise.trim()) {
      return;
    }

    const d = `source-${user.pubkey.slice(0, 8)}-expertise`;

    const expertiseTags = formData.expertise
      .split(',')
      .map((e) => e.trim())
      .filter((e) => e)
      .map((exp) => ['expertise', exp]);

    const tags: string[][] = [
      ['d', d],
      ['title', formData.title],
      ['summary', formData.summary || formData.title],
      ['t', 'source'],
      ['t', 'bitcoin'],
      ['published_at', Math.floor(Date.now() / 1000).toString()],
      ...expertiseTags,
    ];

    if (formData.twitter) {
      tags.push(['twitter', formData.twitter]);
    }
    if (formData.website) {
      tags.push(['website', formData.website]);
    }

    publishEvent(
      {
        kind: 30402,
        content: formData.content,
        tags,
      },
      {
        onSuccess: () => {
          setIsEditDialogOpen(false);
          refetch();
        },
      }
    );
  }, [user, formData, publishEvent, refetch]);

  const expertiseAreas = [
    'all',
    'development',
    'economics',
    'mining',
    'layer2',
    'custody',
    'regulations',
    'merchants',
    'history',
    'technical-analysis',
  ];

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
                Opportunities
              </button>
              <button className="text-amber-400 hover:text-amber-300 transition-colors font-medium text-sm">
                Expertise
              </button>
              <HABOLoginArea className="max-w-xs" />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Expertise</h1>
              <p className="text-slate-400">Bitcoin experts offering their knowledge to help content creators</p>
            </div>
            {user && (
              <Button
                onClick={() => setIsEditDialogOpen(true)}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Post Expertise
              </Button>
            )}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
            <Input
              placeholder="Search expertise..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800 border-slate-700 text-white placeholder-slate-500 rounded-lg"
            />
          </div>
        </div>

        {/* Expertise Filter */}
        <div className="mb-8 overflow-x-auto">
          <Tabs value={selectedExpertise} onValueChange={setSelectedExpertise} className="w-full">
            <TabsList className="bg-slate-800 border border-slate-700 rounded-lg p-1 inline-flex">
              {expertiseAreas.map((area) => (
                <TabsTrigger
                  key={area}
                  value={area}
                  className="capitalize data-[state=active]:bg-amber-500 data-[state=active]:text-white text-sm"
                >
                  {area === 'technical-analysis' ? 'Analysis' : area === 'layer2' ? 'Layer 2' : area}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Sources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="border-slate-800 bg-slate-900/50 backdrop-blur">
                <CardHeader>
                  <Skeleton className="h-6 w-2/3 bg-slate-700 rounded mb-2" />
                  <Skeleton className="h-4 w-full bg-slate-700 rounded" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full bg-slate-700 rounded" />
                </CardContent>
              </Card>
            ))
          ) : filteredSources.length === 0 ? (
            <div className="col-span-full">
              <Card className="border-slate-800 bg-slate-900/50 backdrop-blur border-dashed">
                <CardContent className="py-16 text-center">
                  <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400 text-lg">
                    {searchTerm ? 'No expertise matches your search.' : 'No expertise listings yet.'}
                  </p>
                  {user && (
                    <Button
                      onClick={() => setIsEditDialogOpen(true)}
                      className="mt-6 bg-gradient-to-r from-amber-500 to-orange-500"
                    >
                      Be the First Expert
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            filteredSources.map((source) => <SourceCard key={source.id} source={source} />)
          )}
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Post Your Expertise</DialogTitle>
            <DialogDescription>
              Tell journalists and content creators what you're an expert in and how to reach you.
            </DialogDescription>
          </DialogHeader>

          {!user ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <p className="text-slate-300">You need to log in to post expertise</p>
              <HABOLoginArea className="max-w-xs" />
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="text-sm font-semibold text-slate-200 block mb-2">Expertise Title *</label>
                <Input
                  placeholder="e.g., Lightning Network Developer & Educator"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white placeholder-slate-500"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-200 block mb-2">Brief Summary</label>
                <Input
                  placeholder="One-line professional summary"
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white placeholder-slate-500"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-200 block mb-2">
                  Bio & Credentials *
                </label>
                <Textarea
                  placeholder="Tell journalists about your expertise, experience, and background..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white placeholder-slate-500 resize-none"
                  rows={6}
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-200 block mb-2">
                  Areas of Expertise (comma-separated) *
                </label>
                <Input
                  placeholder="e.g., development, layer2, economics"
                  value={formData.expertise}
                  onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white placeholder-slate-500"
                />
                <p className="text-xs text-slate-500 mt-2">
                  Available: development, economics, mining, layer2, custody, regulations, merchants, history, technical-analysis
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-slate-200 block mb-2">
                    Twitter Handle (Optional)
                  </label>
                  <Input
                    placeholder="@yourhandle"
                    value={formData.twitter}
                    onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white placeholder-slate-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-200 block mb-2">
                    Website (Optional)
                  </label>
                  <Input
                    placeholder="https://yoursite.com"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white placeholder-slate-500"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <Button
                  onClick={handleSaveProfile}
                  disabled={!formData.title.trim() || !formData.content.trim() || !formData.expertise.trim()}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold"
                >
                  Post Expertise
                </Button>
                <Button
                  onClick={() => setIsEditDialogOpen(false)}
                  variant="outline"
                  className="flex-1 border-slate-600 text-white hover:bg-slate-800"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

function SourceCard({ source }: { source: NostrEvent }) {
  const author = useAuthor(source.pubkey);
  const metadata = author.data?.metadata;
  const displayName = metadata?.name ?? genUserName(source.pubkey);
  const profileImage = metadata?.picture;

  const title = source.tags.find(([name]) => name === 'title')?.[1] || 'Expert';
  const expertise = source.tags
    .filter(([name]) => name === 'expertise')
    .map(([, value]) => value);

  const twitter = source.tags.find(([name]) => name === 'twitter')?.[1];
  const website = source.tags.find(([name]) => name === 'website')?.[1];

  return (
    <Card className="border-slate-800 bg-slate-900/50 backdrop-blur hover:border-amber-500/50 transition-all hover:shadow-lg hover:shadow-amber-500/10">
      <CardHeader>
        <div className="flex gap-4 mb-4">
          {profileImage && (
            <img
              src={profileImage}
              alt={displayName}
              className="w-12 h-12 rounded-full object-cover"
            />
          )}
          <div className="flex-1">
            <CardTitle className="text-lg text-white">{title}</CardTitle>
            <CardDescription className="text-slate-400 text-xs">
              {metadata?.nip05 || `${source.pubkey.slice(0, 8)}...`}
            </CardDescription>
            <p className="text-sm text-slate-300 mt-1 font-medium">{displayName}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-slate-300 text-sm leading-relaxed line-clamp-3">
          {source.content}
        </p>

        {expertise.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {expertise.map((exp) => (
              <Badge
                key={exp}
                className="bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 capitalize text-xs"
              >
                {exp === 'layer2' ? 'Layer 2' : exp === 'technical-analysis' ? 'Analysis' : exp}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex gap-2 pt-4 border-t border-slate-700 flex-wrap">
          <button className="flex items-center gap-2 text-slate-400 hover:text-amber-400 transition-colors flex-1 justify-center py-2 rounded hover:bg-slate-800 text-sm">
            <MessageSquare className="w-4 h-4" />
            <span>Message</span>
          </button>
          {twitter && (
            <a
              href={`https://twitter.com/${twitter.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors flex-1 justify-center py-2 rounded hover:bg-slate-800 text-sm"
            >
              <Globe className="w-4 h-4" />
              <span>Twitter</span>
            </a>
          )}
          {website && (
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-slate-400 hover:text-amber-400 transition-colors flex-1 justify-center py-2 rounded hover:bg-slate-800 text-sm"
            >
              <Globe className="w-4 h-4" />
              <span>Website</span>
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default Sources;
