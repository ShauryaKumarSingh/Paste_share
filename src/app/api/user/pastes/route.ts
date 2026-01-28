import { NextRequest, NextResponse } from 'next/server';
import { getPastesByUserId } from '@/lib/paste-store';

/**
 * GET /api/user/pastes
 * Retrieve all pastes for the current user
 */
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 },
      );
    }

    const pastes = await getPastesByUserId(userId);

    return NextResponse.json({
      pastes: pastes.map(p => ({
        id: p.id,
        language: p.language,
        currentViews: p.currentViews,
        maxViews: p.maxViews || null,
        createdAt: p.createdAt,
        expiresAt: p.expiresAt || null,
        isExpired: p.isExpired,
      })),
    });
  } catch (error) {
    console.error('Error fetching user pastes:', error);

    return NextResponse.json(
      { error: 'Failed to retrieve pastes. Please try again.' },
      { status: 500 },
    );
  }
}
