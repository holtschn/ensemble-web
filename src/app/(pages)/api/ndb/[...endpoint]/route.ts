import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/next/ndb/api/proxy';

/**
 * Maps endpoint paths to cache tags for granular cache invalidation.
 * This allows us to invalidate only the affected resources when data changes.
 *
 * @param endpointPath - The endpoint path (e.g., 'scores', 'setlists', 'score', etc.)
 * @returns Array of cache tags for this endpoint
 */
function getTagsForEndpoint(endpointPath: string): string[] {
  const firstSegment = endpointPath.split('/')[0];

  switch (firstSegment) {
    case 'scores':
      return ['ndb-scores'];
    case 'score':
      return ['ndb-scores']; // Single score operations affect scores cache
    case 'setlists':
      return ['ndb-setlists'];
    case 'setlist':
      return ['ndb-setlists']; // Single setlist operations affect setlists cache
    case 'scoreinfo':
      return ['ndb-samples']; // scoreinfo/samples endpoint
    case 'upload':
      return ['ndb-scores']; // File uploads typically relate to scores
    case 'download':
      // Downloads are never cached and never invalidate anything
      return [];
    default:
      // Default: invalidate all caches to be safe
      console.warn(`[NDB API] Unknown endpoint "${firstSegment}" - invalidating all caches`);
      return ['ndb-scores', 'ndb-setlists', 'ndb-samples'];
  }
}

/**
 * Generic handler for all NDB API requests.
 * This acts as a server-side proxy to the actual NDB backend, leveraging Next.js server-side
 * capabilities for fetch caching and security.
 *
 * @param request - The incoming Next.js request object.
 * @param context - The context object containing route parameters.
 * @returns A Next.js response object.
 */
async function handler(request: NextRequest, context: { params: Promise<{ endpoint: string[] }> }) {
  // Reconstruct the endpoint path from the dynamic route segments.
  // e.g., /api/intern/ndb/api/scores/1 -> ['scores', '1'] -> 'scores/1'
  const { endpoint } = await context.params;
  const endpointPath = endpoint.join('/');
  const tags = getTagsForEndpoint(endpointPath);

  try {
    switch (request.method) {
      case 'GET':
        // Downloads should never be cached
        const isDownload = endpointPath.startsWith('download/');
        const getResponse = await apiClient(endpointPath, {
          method: 'GET',
          cache: isDownload ? 'no-store' : 'force-cache',
          next: isDownload ? undefined : { tags },
        });
        return NextResponse.json(getResponse);

      case 'POST':
        const postBody = await request.json();
        const postResponse = await apiClient(endpointPath, {
          method: 'POST',
          body: JSON.stringify(postBody),
        });
        // Invalidate affected caches
        tags.forEach((tag) => revalidateTag(tag));
        return NextResponse.json(postResponse);

      case 'PUT':
        const putBody = await request.json();
        const putResponse = await apiClient(endpointPath, {
          method: 'PUT',
          body: JSON.stringify(putBody),
        });
        // Invalidate affected caches
        tags.forEach((tag) => revalidateTag(tag));
        return NextResponse.json(putResponse);

      default:
        return NextResponse.json({ error: `Method ${request.method} Not Allowed` }, { status: 405 });
    }
  } catch (error) {
    console.error(`[NDB API Proxy Error] Endpoint: ${endpointPath}`, error);
    return NextResponse.json({ error: 'An unexpected internal server error occurred.' }, { status: 500 });
  }
}

// Export the handler for the supported HTTP methods.
// This connects the handler function to the GET, POST, and PUT verbs for this route.
export { handler as GET, handler as POST, handler as PUT };
