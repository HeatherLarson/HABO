# HABO - Help a Bitcoiner Out

HABO is a classified listings marketplace built on Nostr using NIP-99, enabling Bitcoin content creators and experts to post opportunities and respond to each other.

## Overview

HABO uses the NIP-99 classified listings standard (kind 30402) to create a peer-to-peer marketplace where:

- **Journalists/Creators** post listings seeking expert sources and contributors
- **Experts/Sources** post listings offering their expertise and services
- Users browse listings, respond to opportunities, and connect via Nostr direct messages

## Implementation Details

### Using NIP-99 (Kind 30402)

HABO leverages NIP-99's addressable event structure with the following tag extensions:

#### For Query/Opportunity Listings (seeking expertise)

```json
{
  "kind": 30402,
  "content": "Detailed description of what you're looking for...",
  "tags": [
    ["d", "unique-identifier"],
    ["title", "What you're looking for"],
    ["summary", "Short tagline"],
    ["t", "bitcoin"],
    ["t", "query"],
    ["category", "interview"],
    ["deadline", "2026-01-20"],
    ["published_at", "1736800000"]
  ]
}
```

**Categories for Queries:**
- `interview` - Looking for interview guests
- `podcast` - Podcast contributors/guests
- `research` - Research collaboration
- `article` - Article sources
- `documentary` - Documentary subjects
- `analysis` - Technical/market analysis

#### For Source/Expertise Listings (offering services)

```json
{
  "kind": 30402,
  "content": "Bio, credentials, and areas of expertise...",
  "tags": [
    ["d", "unique-identifier"],
    ["title", "Your expertise areas"],
    ["summary", "Brief professional summary"],
    ["t", "bitcoin"],
    ["t", "source"],
    ["expertise", "development"],
    ["expertise", "layer2"],
    ["location", "Online/Your Location"],
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
// Find all query listings
const queries = await nostr.query([
  {
    kinds: [30402],
    '#t': ['query', 'bitcoin'],
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

### Distinguishing Queries from Sources

The `t` tags are the primary differentiator:
- Listings with `["t", "query"]` are opportunities being sought
- Listings with `["t", "source"]` are expertise being offered

Both types use kind 30402, maintaining full NIP-99 compatibility while supporting HABO's dual-listing approach.

## Participation Model

### Creating Listings

Users log in with Nostr and create one of two types:

1. **Query Listings** - Post what you're looking for
   - Title, summary, description
   - Category (interview, podcast, research, article, documentary, analysis)
   - Optional deadline
   - Marked with `["t", "query"]` tag

2. **Source/Expertise Listings** - Post what you offer
   - Professional bio and credentials
   - Areas of expertise (multiple tags)
   - Location (optional)
   - Contact links (Twitter, website)
   - Marked with `["t", "source"]` tag

### Responding to Listings

Users can respond by:
- Sending Nostr direct messages (NIP-04/NIP-17) to the listing author
- Connection facilitation through UI with pre-filled context

### Discovery

Browse and search:
- Filter by category or expertise
- Search by title/content
- Sort by creation date
- View author profiles

## Compatibility

HABO is fully compatible with:
- **NIP-99**: All listings use kind 30402 (addressable classified events)
- **NIP-04/NIP-17**: Direct messaging for responding to listings
- **NIP-05**: NIP-05 identifiers for author verification
- **All Nostr clients**: Kind 30402 is a standard, published event

## Future Enhancements

Potential extensions while maintaining NIP-99 compatibility:
- Payment/zap integration (NIP-57)
- Ratings/reviews for sources
- Featured listings with satoshi payments
- Calendar integration for interview scheduling
- Portfolio/credential verification
