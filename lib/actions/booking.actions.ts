import { connect } from "http2";
import connectToDatabase from "../mongodb";
import Booking from "@/database/booking.model";

export const createBooking= async ({eventId, slug, email}: {eventId: string; slug: string; email: string})=> {
    try{
        await connectToDatabase();
        await Booking.create({eventId, slug, email})

        return {success: true};

    }catch(e){
        console.error('create booking failed', e);
        return{success: false};

    }
}

