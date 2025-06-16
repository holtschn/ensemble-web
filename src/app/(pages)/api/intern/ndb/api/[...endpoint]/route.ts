import { NextRequest, NextResponse } from 'next/server';
import { ndbApi, ApiError } from '@/next/ndb/api/client';

/**
 * Generic handler for all NDB API requests.
 * This acts as a server-side proxy to the actual NDB backend, leveraging Next.js server-side capabilities for fetch caching and security.
 *
 * @param request - The incoming Next.js request object.
 * @param context - The context object containing route parameters.
 * @returns A Next.js response object.
 */
async function handler(request: NextRequest, context: { params: { endpoint: string[] } }) {
  // Reconstruct the endpoint path from the dynamic route segments.
  // e.g., /api/intern/ndb/api/scores/1 -> ['scores', '1'] -> 'scores/1'
  const { endpoint } = context.params;
  const endpointPath = endpoint.join('/');

  try {
    let responseData;

    // Handle different HTTP methods by calling the corresponding server-side API client method.
    switch (request.method) {
      case 'GET':
        responseData = await ndbApi.get(endpointPath);
        break;

      case 'POST':
        const postBody = await request.json();
        responseData = await ndbApi.post(endpointPath, postBody);
        break;

      case 'PUT':
        const putBody = await request.json();
        responseData = await ndbApi.put(endpointPath, putBody);
        break;

      // Respond with an error for unsupported methods.
      default:
        return NextResponse.json({ error: `Method ${request.method} Not Allowed` }, { status: 405 });
    }

    // Return the successful response from the NDB backend.
    return NextResponse.json(responseData);
  } catch (error) {
    console.error(`[NDB API Proxy Error] Endpoint: ${endpointPath}`, error);

    // Handle custom API errors thrown by the client.
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message, code: error.code }, { status: error.status || 500 });
    }

    // Handle unexpected errors.
    return NextResponse.json({ error: 'An unexpected internal server error occurred.' }, { status: 500 });
  }
}

// Export the handler for the supported HTTP methods.
// This connects the handler function to the GET, POST, and PUT verbs for this route.
export { handler as GET, handler as POST, handler as PUT };
