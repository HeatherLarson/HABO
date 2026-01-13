import { useSeoMeta } from '@unhead/react';
import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNostr } from '@nostrify/react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoginArea } from '@/components/auth/LoginArea';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useNostrPublish } from '@/hooks/useNostrPublish';
import { useAuthor } from '@/hooks/useAuthor';
import { Skeleton } from '@/components/ui/skeleton';
import { genUserName } from '@/lib/genUserName';
import { Search, Plus, MessageSquare, Heart } from 'lucide-react';
import type { NostrEvent } from '@nostrify/nostrify';

const HABO_QUERY_KIND = 9802; // Custom kind for HABO queries

interface HABOQuery extends NostrEvent {
  title?: string;
  category?: string;
  deadline?: string;
}

interface QueryFormData {
  title: string;
  content: string;
  category: string;
  deadline: string;
}

const Queries = () => {
  useSeoMeta({
    title: 'Queries - HABO',
    description: 'Browse and post queries for Bitcoin content creators looking for expert sources.',
  });

  const { user } = useCurrentUser();
  const navigate = useNavigate();
  const { nostr } = useNostr();
  const { mutate: publishEvent } = useNostrPublish();

  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState<QueryFormData>({
    title: '',
    content: '',
    category: 'general',
    deadline: '',
  });
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Fetch queries from Nostr
  const { data: queries = [], isLoading, isFetching } = useQuery({
    queryKey: ['queries', selectedCategory],
    queryFn: async (c) => {
      const signal = AbortSignal.any([c.signal, AbortSignal.timeout(3000)]);
      const filter: Record<string, unknown> = {
        kinds: [HABO_QUERY_KIND],
        limit: 50,
      };

      if (selectedCategory !== 'all') {
        filter['#category'] = [selectedCategory];
      }

      const events = await nostr.query([filter], { signal });
      return events.sort((a, b) => b.created_at - a.created_at);
    },
    staleTime: 30000,
  });

  const filteredQueries = queries.filter((query) => {
    const title = query.tags.find(([name]) => name === 'title')?.[1] || '';
    const content = query.content.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    return title.toLowerCase().includes(searchLower) || content.includes(searchLower);
  });

  const handleCreateQuery = useCallback(() => {
    if (!user || !formData.title.trim() || !formData.content.trim()) {
      return;
    }

    const tags: string[][] = [
      ['title', formData.title],
      ['category', formData.category],
      ['t', formData.category], // For relay-level filtering
    ];

    if (formData.deadline) {
      tags.push(['deadline', formData.deadline]);
    }

    publishEvent(
      {
        kind: HABO_QUERY_KIND,
        content: formData.content,
        tags,
      },
      {
        onSuccess: () => {
          setIsCreateDialogOpen(false);
          setFormData({ title: '', content: '', category: 'general', deadline: '' });
        },
      }
    );
  }, [user, formData, publishEvent]);

  const categories = [
    'all',
    'general',
    'news',
    'interview',
    'podcast',
    'documentary',
    'research',
    'analysis',
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
              <button className="text-amber-400 hover:text-amber-300 transition-colors font-medium text-sm">
                Queries
              </button>
              <button
                onClick={() => navigate('/sources')}
                className="text-slate-300 hover:text-white transition-colors font-medium text-sm"
              >
                Sources
              </button>
              <LoginArea className="max-w-xs" />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Queries</h1>
              <p className="text-slate-400">Find journalists and creators looking for your expertise</p>
            </div>
            {user && (
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Post Query
              </Button>
            )}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
            <Input
              placeholder="Search queries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800 border-slate-700 text-white placeholder-slate-500 rounded-lg"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="bg-slate-800 border border-slate-700 rounded-lg p-1">
              {categories.map((cat) => (
                <TabsTrigger
                  key={cat}
                  value={cat}
                  className="capitalize data-[state=active]:bg-amber-500 data-[state=active]:text-white"
                >
                  {cat}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Queries List */}
        <div className="space-y-6">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} className="border-slate-800 bg-slate-900/50 backdrop-blur">
                <CardHeader>
                  <Skeleton className="h-6 w-2/3 bg-slate-700 rounded" />
                  <Skeleton className="h-4 w-1/3 bg-slate-700 rounded mt-2" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full bg-slate-700 rounded" />
                    <Skeleton className="h-4 w-4/5 bg-slate-700 rounded" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : filteredQueries.length === 0 ? (
            <Card className="border-slate-800 bg-slate-900/50 backdrop-blur border-dashed">
              <CardContent className="py-16 text-center">
                <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 text-lg">
                  {searchTerm ? 'No queries match your search.' : 'No queries found. Check back soon!'}
                </p>
                {user && !searchTerm && (
                  <Button
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="mt-6 bg-gradient-to-r from-amber-500 to-orange-500"
                  >
                    Be the First to Post
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredQueries.map((query) => <QueryCard key={query.id} query={query as HABOQuery} />)
          )}
        </div>
      </div>

      {/* Create Query Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Post a Query</DialogTitle>
            <DialogDescription>
              Describe what you're looking for. Sources on HABO will see your query and respond if they're a good fit.
            </DialogDescription>
          </DialogHeader>

          {!user ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <p className="text-slate-300">You need to log in to post a query</p>
              <LoginArea className="max-w-xs" />
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="text-sm font-semibold text-slate-200 block mb-2">Query Title</label>
                <Input
                  placeholder="e.g., Bitcoin Layer 2 Solutions Expert for Podcast"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white placeholder-slate-500"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-200 block mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg"
                >
                  {categories.filter((c) => c !== 'all').map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-200 block mb-2">
                  Description
                </label>
                <Textarea
                  placeholder="Describe what you're looking for in detail..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white placeholder-slate-500 resize-none"
                  rows={6}
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-200 block mb-2">
                  Deadline (Optional)
                </label>
                <Input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <div className="flex gap-4 pt-6">
                <Button
                  onClick={handleCreateQuery}
                  disabled={!formData.title.trim() || !formData.content.trim()}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold"
                >
                  Post Query
                </Button>
                <Button
                  onClick={() => setIsCreateDialogOpen(false)}
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

function QueryCard({ query }: { query: HABOQuery }) {
  const author = useAuthor(query.pubkey);
  const title = query.tags.find(([name]) => name === 'title')?.[1] || 'Untitled Query';
  const category = query.tags.find(([name]) => name === 'category')?.[1] || 'general';
  const deadline = query.tags.find(([name]) => name === 'deadline')?.[1];

  const metadata = author.data?.metadata;
  const displayName = metadata?.name ?? genUserName(query.pubkey);
  const profileImage = metadata?.picture;

  const createdDate = new Date(query.created_at * 1000).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <Card className="border-slate-800 bg-slate-900/50 backdrop-blur hover:border-amber-500/50 transition-all cursor-pointer hover:shadow-lg hover:shadow-amber-500/10">
      <CardHeader>
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-3 flex-1">
            {profileImage && (
              <img
                src={profileImage}
                alt={displayName}
                className="w-10 h-10 rounded-full object-cover"
              />
            )}
            <div className="flex-1">
              <p className="text-sm text-slate-400">{displayName}</p>
              <p className="text-xs text-slate-500">{createdDate}</p>
            </div>
          </div>
          <span className="bg-slate-800 text-slate-300 text-xs px-3 py-1 rounded-full capitalize">
            {category}
          </span>
        </div>
        <CardTitle className="text-xl text-white">{title}</CardTitle>
        <CardDescription className="text-slate-400 line-clamp-2">
          {query.content}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex gap-6">
            <button className="flex items-center gap-2 text-slate-400 hover:text-amber-400 transition-colors">
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm">Respond</span>
            </button>
            <button className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors">
              <Heart className="w-4 h-4" />
              <span className="text-sm">Save</span>
            </button>
          </div>
          {deadline && (
            <p className="text-xs text-orange-400">
              Due: {new Date(deadline).toLocaleDateString()}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default Queries;
