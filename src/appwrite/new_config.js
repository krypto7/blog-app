import config from "../config/config";
import { Client, ID, Databases, Query, Storage } from "appwrite";

export class DatabaseService {
  client = new Client(); // add client
  databases;
  bucket;

  constructor() {
    this.client
      .setEndpoint(config.appwriteurl) // Your API Endpoint
      .setProject(config.projectId);
    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }

  async createPost({ title, slug, content, featuredImage, status, userid }) {
    try {
      return await this.databases.createDocument(
        config.databaseId,
        config.collectionId,
        slug,
        {
          title,
          content,
          featuredImage,
          status,
          userid,
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  async upadatePost(slug, { title, content, featuredImage, status }) {
    try {
      return await this.databases.updateDocument(
        config.appwriteurl,
        config.collectionId,
        slug,
        {
          title,
          content,
          featuredImage,
          status,
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  async deletePost(slug) {
    try {
      await this.databases.deleteDocument(
        config.databaseId,
        config.collectionId,
        slug
      );
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async getPosts(queries = [Query.equal("status", "active")]) {
    try {
      return this.databases.listDocuments(
        config.appwriteurl,
        config.collectionId,
        queries
      );
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  //file upload
  async uploadFile(file) {
    try {
      return await this.bucket.createFile(config.bucketId, ID.unique, file);
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async deleteFile(fileId) {
    try {
      return await this.bucket.deleteFile(config.bucketId, fileId);
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  getFilePreview(fileId) {
    return this.bucket.getFilePreview(config.bucketId, fileId);
  }
}

const databaseService = new DatabaseService();

export default databaseService;
