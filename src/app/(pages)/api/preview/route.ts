import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest): Promise<Response> {
  const searchParams = request.nextUrl?.searchParams;

  // Check redirect target available
  const url = searchParams ? searchParams.get('url') : undefined;
  if (!url) {
    return new Response('No URL provided', { status: 404 });
  }

  // Check secret, i.e. request from the "correct" CMS
  const secret = searchParams ? searchParams.get('secret') : undefined;
  if (secret !== process.env.NEXT_DRAFT_SECRET) {
    return new Response('Invalid token', { status: 401 });
  }

  // Check user
  const token = request.cookies.get(process.env.PAYLOAD_COOKIE_TOKEN_NAME!)?.value;
  if (!token) {
    new Response('You are not allowed to preview this page', { status: 403 });
  }
  const userReq = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/me`, {
    headers: {
      Authorization: `JWT ${token}`,
    },
  });

  const userRes = await userReq.json();
  if (!userReq.ok || !userRes?.user) {
    (await draftMode()).disable();
    return new Response('You are not allowed to preview this page', { status: 403 });
  }

  (await draftMode()).enable();

  redirect(url);
}
