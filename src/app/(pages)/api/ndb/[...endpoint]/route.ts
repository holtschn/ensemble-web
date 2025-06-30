import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/next/ndb/api/proxy';

const globalTag = 'caching-tag';

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

  try {
    switch (request.method) {
      case 'GET':
        const getResponse = await apiClient(endpointPath, {
          method: 'GET',
          cache: 'force-cache',
          next: { tags: [globalTag] },
        });
        return NextResponse.json(getResponse);

      case 'POST':
        const postBody = await request.json();
        const postRepsonse = await apiClient(endpointPath, {
          method: 'POST',
          body: JSON.stringify(postBody),
        });
        revalidateTag(globalTag);
        return NextResponse.json(postRepsonse);

      case 'PUT':
        const putBody = await request.json();
        const putResponse = await apiClient(endpointPath, {
          method: 'PUT',
          body: JSON.stringify(putBody),
        });
        revalidateTag(globalTag);
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
