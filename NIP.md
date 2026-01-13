# HABO Nostr Protocol Extensions

HABO (Help a Bitcoiner Out) defines custom Nostr event kinds for managing queries and sources within the Bitcoin content creator ecosystem.

## Event Kinds

### Kind 9802: HABO Query

A query posted by journalists, reporters, podcasters, and documentarians seeking expert sources for their Bitcoin-related stories.

**Kind Range**: 9802 (Regular Event)

**Structure**:
- `content`: The detailed query description explaining what the author is looking for
- `tags`:
  - `title` (required): Short title of the query
  - `category` (recommended): Category of the query (general, news, interview, podcast, documentary, research, analysis)
  - `t` (recommended): Tag for relay-level filtering (matches category value)
  - `deadline` (optional): ISO 8601 date when sources should respond by

**Example**:
```json
{
  "kind": 9802,
  "content": "Looking for an expert on Bitcoin's role in El Salvador for a podcast episode. Need someone who can discuss both technical and economic implications.",
  "tags": [
    ["title", "Bitcoin in El Salvador - Podcast Interview"],
    ["category", "podcast"],
    ["t", "podcast"],
    ["deadline", "2026-01-20"]
  ]
}
```

**Use Cases**:
- Journalists seeking expert sources
- Podcasters finding guests
- Documentary filmmakers identifying interview subjects
- Content creators finding research contributors

---

### Kind 9803: HABO Source

A profile for an expert source offering their knowledge in Bitcoin-related topics to help journalists and content creators.

**Kind Range**: 9803 (Regular Event)

**Structure**:
- `content`: Bio, credentials, and areas of expertise overview
- `tags`:
  - `expertise` (required, multiple): Areas the source has expertise in
  - `twitter` (optional): Twitter handle for contact
  - `website` (optional): Personal website or portfolio URL

**Expertise Areas** (suggested values):
- development
- economics
- mining
- layer2
- custody
- regulations
- merchants
- history
- technical-analysis

**Example**:
```json
{
  "kind": 9803,
  "content": "Senior Bitcoin developer with 10+ years of experience building Lightning Network infrastructure. Have contributed to major Bitcoin implementations and love discussing the technical and economic aspects of Bitcoin scaling.",
  "tags": [
    ["expertise", "development"],
    ["expertise", "layer2"],
    ["expertise", "economics"],
    ["twitter", "@bitcoindev"],
    ["website", "https://bitcoindev.example.com"]
  ]
}
```

**Use Cases**:
- Building a discoverable source directory for journalists
- Enabling content creators to find qualified experts
- Creating searchable expertise profiles

---

## Query Workflow

1. **Source Registration**: An expert creates a kind 9803 event to register as a source, listing their expertise areas
2. **Query Publication**: A journalist/creator publishes a kind 9802 event describing what they need
3. **Discovery**: Sources can search and filter queries to find opportunities matching their expertise
4. **Connection**: Direct messaging (NIP-04/NIP-17) facilitates the connection between journalist and source

## Relay Filtering

Both kinds support efficient relay-level filtering using tags:

```typescript
// Find all podcast queries
const queries = await nostr.query([
  {
    kinds: [9802],
    '#t': ['podcast'],
  }
], { signal });

// Find all sources with mining expertise
const miningSources = await nostr.query([
  {
    kinds: [9803],
    '#expertise': ['mining'],
  }
], { signal });
```

## Extensibility

The `tags` array in both kinds is extensible. Additional tags can be added by clients for specific functionality without breaking compatibility with existing implementations.

## Compatibility

HABO is designed to be fully compatible with all Nostr clients and relays that support regular events (kind < 10000). The use of single-letter tags enables efficient relay-level filtering while maintaining interoperability.
