/* eslint-disable @typescript-eslint/no-explicit-any */
import Event from "@/database/event.model";
import connectToDatabase from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary} from 'cloudinary';
import { events as fallbackEvents } from "@/lib/constants";

export async function POST(req: NextRequest) {
    try{
        await connectToDatabase();
                // Support both JSON and form-data bodies
                const contentType = req.headers.get('content-type') || '';
                let payload: Record<string, unknown>;

                if (contentType.includes('application/json')) {
                    payload = await req.json();
                } else {
                    const formData = await req.formData();
                    payload = Object.fromEntries(formData.entries());
                }

                // Create event; Mongoose schema will validate required fields
                const file= payload.image as File;

                if(!file){
                    return NextResponse.json({message: 'Image file is required'}, {status: 400});
                }

                const tags= JSON.parse(payload.tags as string);
                const agenda= JSON.parse(payload.agenda as string);



                const arrayBuffer = await file.arrayBuffer();

                const buffer= Buffer.from(arrayBuffer);

                const uploadResult= await new Promise((resolve, reject)=>{
                    cloudinary.uploader.upload_stream({resource_type: 'image', folder: 'DevEvent'},  (error, results)=>{
                        if(error) return reject(error);
                        resolve(results);
                    }).end(buffer);
                });

                payload.image= (uploadResult as {secure_url: string}).secure_url;

                const createdEvent = await Event.create({
                    ...payload,
                    tags:tags,
                    agenda: agenda
                });
        return NextResponse.json({message: 'Event Created Successfully', event: createdEvent}, {status: 201});

    } catch(e){
        return NextResponse.json({message: 'Event Creation Failed', error: e instanceof Error ? e.message : 'Unknown'}, {status: 500});

    }
}

export async function GET(req: NextRequest) {
    try{
        // Check if MONGODB_URI exists before trying to connect
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            console.error('MONGODB_URI environment variable is not set');
            console.log('Using fallback events data');
            return NextResponse.json({
                message: 'Events loaded from fallback data', 
                events: fallbackEvents
            }, {status: 200});
        }

        await connectToDatabase();
        const events = await Event.find().sort({ createdAt: -1 });

        return NextResponse.json({message: 'Events Fetched Successfully', events}, {status: 200});
    }catch(e){
        console.error('Database error:', e);
        console.log('Using fallback events data');
        // Return fallback events instead of empty array
        return NextResponse.json({
            message: 'Events loaded from fallback data', 
            events: fallbackEvents,
            error: e instanceof Error ? e.message : 'Unknown database error'
        }, {status: 200});
    }
}

// a route that accepts a slug as input and returns the event details


