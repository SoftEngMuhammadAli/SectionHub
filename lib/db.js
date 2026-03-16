import mongoose from "mongoose";
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/sectionhub";
const cache = global.__mongooseCache ?? { conn: null, promise: null };
if (!global.__mongooseCache)
    global.__mongooseCache = cache;
export async function connectToDatabase() {
    if (cache.conn)
        return cache.conn;
    if (!cache.promise) {
        cache.promise = mongoose.connect(MONGODB_URI, {
            dbName: MONGODB_URI.split("/").pop()?.split("?")[0] || "sectionhub",
            bufferCommands: false,
        });
    }
    cache.conn = await cache.promise;
    return cache.conn;
}
export default connectToDatabase;
