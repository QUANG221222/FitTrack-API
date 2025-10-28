import { env } from './environment'
import { Db, MongoClient, ServerApiVersion } from 'mongodb'

// Initialize a fitTrackDatabaseInstance object with an initial value of null
let fitTrackDatabaseInstance: Db | null = null

// Initialize a mongoClientInstance object to connect to MongoDB
const mongoClientInstance: MongoClient = new MongoClient(
  String(env.MONGODB_URI),
  {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true
    }
  }
)

//Connect to MongoDB
export const CONNECT_DB = async () => {
  // Call the connection method on the mongoClientInstance

  await mongoClientInstance.connect()

  // Assign the connected mongoClientInstance to the fitTrackDatabaseInstance
  fitTrackDatabaseInstance = mongoClientInstance.db(String(env.DATABASE_NAME))
}

// Function to get the connected database instance
export const GET_DB = () => {
  if (!fitTrackDatabaseInstance)
    throw new Error('Must connect to MongoDB first')
  return fitTrackDatabaseInstance
}
