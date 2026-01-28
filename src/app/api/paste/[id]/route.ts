import { NextRequest, NextResponse } from 'next/server';
import { PasteViewResponse, Language } from '@/types';
import { isPasteExpired, isTimeExpired, isViewsExpired } from '@/lib/utils';
import { getPasteById, incrementViews } from '@/lib/paste-store';

/**
 * GET /api/paste/[id]
 * Retrieve a paste and increment view count
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
 
    // Validate ID
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Invalid paste ID' }, { status: 400 });
    }

    // Fetch paste from store
    let paste = await getPasteById(id);

    if (!paste) {
      return NextResponse.json(
        { error: 'Paste not found' },
        { status: 404 },
      );
    }

    // Check if expired by time
    if (isTimeExpired(paste.expiresAt ? new Date(paste.expiresAt) : null)) {
      // Mark expired in store
      await incrementViews(id);
      return NextResponse.json(
        { error: 'Paste has expired (time limit)' },
        { status: 410 }, // 410 Gone
      );
    }

    // Check if expired by views (before incrementing)
    if (isViewsExpired(paste.currentViews, paste.maxViews || null)) {
      return NextResponse.json(
        { error: 'Paste has expired (view limit reached)' },
        { status: 410 }, // 410 Gone
      );
    }

    // Increment view count
    paste = await incrementViews(id);
    if (!paste) {
      return NextResponse.json(
        { error: 'Paste not found' },
        { status: 404 },
      );
    }

    // Build response
    const response: PasteViewResponse = {
      content: paste.content,
      language: paste.language as Language,
      currentViews: paste.currentViews,
      maxViews: paste.maxViews || null,
      expiresAt: paste.expiresAt || null,
      createdAt: paste.createdAt,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching paste:', error);

    return NextResponse.json(
      { error: 'Failed to retrieve paste. Please try again.' },
      { status: 500 },
    );
  }
}