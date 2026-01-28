import { NextRequest, NextResponse } from 'next/server';
import { CreatePasteSchema, CreatePasteResponseType } from '@/types';
import { calculateExpirationDate, generateShareUrl } from '@/lib/utils';
import { createPaste as createPasteStore } from '@/lib/paste-store';

/**
 * POST /api/paste
 * Create a new paste
 */
export async function POST(request: NextRequest) {
  try {
    // Get user from localStorage (sent in header or body)
    const body = await request.json();
    const userId = body.userId || request.headers.get('x-user-id');

    // Validate input
    const validationResult = CreatePasteSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid request',
          details: validationResult.error.issues,
        },
        { status: 400 },
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 },
      );
    }

    const { content, language, expireTime, maxViews } = validationResult.data;

    // Calculate expiration date
    const expiresAt = calculateExpirationDate(expireTime);

    // Create paste (file-backed store in dev)
    const paste = await createPasteStore({
      content,
      language,
      userId,
      expiresAt: expiresAt ? expiresAt.toISOString() : null,
      maxViews: maxViews || null,
    });

    // Generate share URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const url = generateShareUrl(paste.id, baseUrl);

    const response: CreatePasteResponseType = {
      id: paste.id,
      url,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating paste:', error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: 'Failed to create paste. Please try again.' },
      { status: 500 },
    );
  }
}
