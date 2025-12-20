import Event from '@/database/event.model';
import connectToDatabase from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Context type for dynamic route params in Next.js App Router
 */
interface RouteContext {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * GET /api/events/[slug]
 * Fetches a single event by its slug
 * 
 * @param req - Next.js request object
 * @param context - Route context containing dynamic params
 * @returns JSON response with event data or error message
 */
export async function GET(
  req: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  try {
    // Extract slug from dynamic route params
    const { slug } = await context.params;

    // Validate slug parameter
    if (!slug || typeof slug !== 'string' || slug.trim().length === 0) {
      return NextResponse.json(
        { 
          message: 'Invalid slug parameter', 
          error: 'Slug must be a non-empty string' 
        },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Query event by slug
    const event = await Event.findOne({ slug: slug.toLowerCase().trim() })
      .lean()
      .exec();

    // Handle event not found
    if (!event) {
      return NextResponse.json(
        { 
          message: 'Event not found', 
          error: `No event found with slug: ${slug}` 
        },
        { status: 404 }
      );
    }

    // Return event data
    return NextResponse.json(
      { 
        message: 'Event retrieved successfully', 
        event 
      },
      { status: 200 }
    );

  } catch (error) {
    // Handle database or unexpected errors
    console.error('Error fetching event by slug:', error);
    
    return NextResponse.json(
      { 
        message: 'Failed to retrieve event', 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      },
      { status: 500 }
    );
  }
}
