import { MongoClient, Collection } from 'mongodb'

export const MongoHelper = {
  client: null as MongoClient,
  url: null as string,

  async connect (url: string): Promise<void> {
    this.url = url
    this.client = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  },

  async disconnect (): Promise<void> {
    await this.client.close()
    this.client = null
  },

  async getCollection (name: string): Promise<Collection> {
    if (!this.client?.isConnected()) {
      await this.connect(this.url)
    }
    return this.client.db().collection(name)
  },

  map: <T>(collection: any): T => {
    const { _id, ...collectionWithoudId } = collection
    return {
      id: _id,
      ...collectionWithoudId
    }
  }
}
