import connectMongo from './lib/mongodb.js';
import { Booking } from './models/Booking.js';
import { SelfDriveRequest } from './models/SelfDriveRequest.js';
import { Car } from './models/Car.js';
import dotenv from 'dotenv';
dotenv.config();

async function testCounts() {
    console.log("Connecting to MongoDB...");
    await connectMongo();
    console.log("Connected. Fetching data...");
    
    try {
        const totalBookings = await Booking.countDocuments();
        const selfDriveRequests = await SelfDriveRequest.countDocuments();
        const totalCars = await Car.countDocuments();
        
        console.log("----- Test Results -----");
        console.log(`Total Bookings: ${totalBookings}`);
        console.log(`Self Drive Requests: ${selfDriveRequests}`);
        console.log(`Total Cars: ${totalCars}`);
        console.log("------------------------");
    } catch(e) {
        console.error(e);
    }
    
    process.exit(0);
}

testCounts();
