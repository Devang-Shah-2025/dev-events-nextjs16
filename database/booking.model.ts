/* eslint-disable @typescript-eslint/no-explicit-any */
import { Document, model, models, Schema, Types } from 'mongoose';
import Event from './event.model';

/**
 * TypeScript interface for Booking document
 * Extends Mongoose Document to include type safety
 */
export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Booking Schema Definition
 * References Event model and validates email format
 */
const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
      index: true, // Index for faster queries
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      validate: {
        validator: function (email: string): boolean {
          // RFC 5322 compliant email validation
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(email);
        },
        message: 'Please provide a valid email address',
      },
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

/**
 * Pre-save hook: Verify that the referenced event exists
 * Prevents orphaned bookings by checking event existence before save
 */
BookingSchema.pre('save', async function (next: any) {
  // Only validate eventId if it's new or has been modified
  if (this.isNew || this.isModified('eventId')) {
    try {
      const eventExists = await Event.findById(this.eventId);
      
      if (!eventExists) {
        throw new Error(
          `Event with ID ${this.eventId} does not exist. Cannot create booking.`
        );
      }
      
      next();
    } catch (error) {
      next(error as Error);
    }
  } else {
    next();
  }
});

// Create index on eventId for faster lookups
BookingSchema.index({ eventId: 1 });

/**
 * Export Booking model
 * Uses models cache to prevent model recompilation in development
 */
const Booking = models.Booking || model<IBooking>('Booking', BookingSchema);

export default Booking;
