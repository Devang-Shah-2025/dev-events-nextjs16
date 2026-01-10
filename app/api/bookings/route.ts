import connectToDatabase from '@/lib/mongodb';
import Booking from '@/database/booking.model';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eventId, email } = body as { eventId?: string; email?: string };

    if (!eventId || typeof eventId !== 'string') {
      return NextResponse.json({ message: 'eventId is required' }, { status: 400 });
    }

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ message: 'email is required' }, { status: 400 });
    }

    await connectToDatabase();

    const created = await Booking.create({ eventId, email });

    return NextResponse.json({ success: true, booking: created }, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
