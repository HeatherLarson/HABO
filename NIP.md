# HABO - Help a Bitcoiner Out

HABO is a community help network built on Nostr using NIP-99, enabling Bitcoin reporters, podcasters, and content creators to find expert sources and collaborators.

## Overview

HABO uses the NIP-99 classified listings standard (kind 30402) to create a peer-to-peer community help network where:

- **Journalists/Reporters/Podcasters** post requests seeking expert sources and collaborators
- **Experts/Sources** post their availability to help with content creation
- Users browse requests, connect with each other, and collaborate via Nostr direct messages

## Implementation Details

### Using NIP-99 (Kind 30402)

HABO leverages NIP-99's addressable event structure with the following tag extensions:

#### For Help Requests (seeking sources and collaborators)

```json
{
  "kind": 30402,
  "content": "Detailed description of what help you need...",
  "tags": [
    ["d", "unique-identifier"],
    ["title", "What you need help with"],
    ["summary", "Short description"],
    ["t", "bitcoin"],
    ["t", "request"],
    ["category", "interview"],
    ["deadline", "2026-01-20"],
    ["published_at", "1736800000"]
  ]
}
```

**Categories for Help Requests:**
- `interview` - Looking for interview guests
- `podcast` - Podcast guests/contributors
- `research` - Research collaboration
- `article` - Article sources
- `documentary` - Documentary interview subjects
- `analysis` - Technical/analysis help

#### For Source/Expert Availability Listings

```json
{
  "kind": 30402,
  "content": "Bio, credentials, and areas of expertise. Tell creators how you can help...",
  "tags": [
    ["d", "unique-identifier"],
    ["title", "Your expertise areas"],
    ["summary", "Brief professional summary"],
    ["t", "bitcoin"],
    ["t", "source"],
    ["expertise", "development"],
    ["expertise", "layer2"],
    ["published_at", "1736800000"]
  ]
}
```

**Standard Expertise Tags:**
- `development` - Bitcoin protocol development
- `economics` - Bitcoin economics and theory
- `mining` - Mining and hashrate
- `layer2` - Lightning Network, Sidechains
- `custody` - Self-custody, key management
- `regulations` - Regulatory and legal
- `merchants` - Merchant adoption
- `history` - Bitcoin history and philosophy
- `technical-analysis` - Market analysis

### Filtering Strategy

The implementation uses `t` tags for efficient relay-level filtering:

```typescript
// Find all help requests
const requests = await nostr.query([
  {
    kinds: [30402],
    '#t': ['request', 'bitcoin'],
  }
], { signal });

// Find all source listings
const sources = await nostr.query([
  {
    kinds: [30402],
    '#t': ['source', 'bitcoin'],
  }
], { signal });

// Find sources with specific expertise
const miningExperts = await nostr.query([
  {
    kinds: [30402],
    '#t': ['source', 'bitcoin'],
    '#expertise': ['mining'],
  }
], { signal });
```

### Distinguishing Requests from Sources

The `t` tags are the primary differentiator:
- Listings with `["t", "request"]` are calls for help seeking sources and collaborators
- Listings with `["t", "source"]` are experts offering to help with content creation

Both types use kind 30402, maintaining full NIP-99 compatibility while supporting HABO's dual-listing approach.

## Participation Model

### Creating Listings

Users log in with Nostr and create one of two types:

1. **Help Request Listings** - Post what help you need
   - Title, summary, detailed description of your project
   - Category (interview, podcast, research, article, documentary, analysis)
   - Optional response deadline
   - Marked with `["t", "request"]` tag
   - For journalists, reporters, podcasters, documentarians, and content creators

2. **Source/Expertise Listings** - Post your availability to help
   - Professional bio and credentials
   - Areas of expertise where you can help (multiple tags)
   - Contact links (Twitter, website, Nostr)
   - Marked with `["t", "source"]` tag
   - For experts, analysts, developers, and knowledgeable Bitcoiners

### Connecting

Collaboration happens through:
- Sending Nostr direct messages (NIP-04/NIP-17) to connect
- Building community relationships
- Sharing knowledge and expertise

### Discovery

Browse and search:
- Filter by category or expertise
- Search by title/content
- Sort by creation date
- View author profiles and credentials

## Compatibility

HABO is fully compatible with:
- **NIP-99**: All listings use kind 30402 (addressable classified events)
- **NIP-04/NIP-17**: Direct messaging for connecting with sources
- **NIP-05**: NIP-05 identifiers for author verification
- **All Nostr clients**: Kind 30402 is a standard, published event

## Future Enhancements

Potential extensions while maintaining NIP-99 compatibility:
- Ratings/reviews from collaborations
- Calendar integration for interview scheduling
- Portfolio/credential verification
- Community trust signals
- Featured listings visibility
- Topic-based collections
