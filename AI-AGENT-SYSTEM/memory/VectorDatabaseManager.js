/**
 * Vector Database Manager
 * Handles embeddings and vector storage for semantic search
 */

const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

class VectorDatabaseManager {
  constructor(config = {}) {
    this.apiKey = config.apiKey || process.env.VECTOR_DB_API_KEY;
    this.environment = config.environment || process.env.VECTOR_ENV || 'production';
    this.indexName = config.indexName || 'ai-agent-memory';
    this.embeddingModel = config.embeddingModel || 'text-embedding-3-small';
    this.openaiKey = config.openaiKey || process.env.OPENAI_API_KEY;
    
    this.baseUrl = config.baseUrl || 'https://api.pinecone.io/v1';
    this.openaiUrl = 'https://api.openai.com/v1/embeddings';
    
    this.initialized = false;
    this.cache = new Map(); // Local cache for frequent queries
    this.batchSize = 100;
  }

  /**
   * Initialize vector database connection
   */
  async initialize() {
    try {
      if (!this.apiKey) {
        throw new Error('Vector DB API key not configured');
      }
      
      // Verify connection to Pinecone
      const response = await axios.get(`${this.baseUrl}/indexes/${this.indexName}`, {
        headers: {
          'Api-Key': this.apiKey,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✓ Vector database connected:', this.indexName);
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Vector DB initialization failed:', error.message);
      this.initialized = false;
      return false;
    }
  }

  /**
   * Generate embeddings for text using OpenAI
   */
  async generateEmbedding(text) {
    try {
      if (!this.openaiKey) {
        throw new Error('OpenAI API key not configured');
      }

      // Check cache first
      const cacheKey = `emb_${text.substring(0, 100)}`;
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey);
      }

      const response = await axios.post(
        this.openaiUrl,
        {
          input: text,
          model: this.embeddingModel
        },
        {
          headers: {
            'Authorization': `Bearer ${this.openaiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const embedding = response.data.data[0].embedding;
      
      // Cache the result
      this.cache.set(cacheKey, embedding);
      
      return embedding;
    } catch (error) {
      console.error('Embedding generation failed:', error.message);
      throw new Error(`Failed to generate embedding: ${error.message}`);
    }
  }

  /**
   * Store memory with embedding
   */
  async storeMemory(memory) {
    try {
      const {
        userId,
        taskId,
        content,
        metadata = {},
        type = 'interaction'
      } = memory;

      if (!content) {
        throw new Error('Memory content is required');
      }

      // Generate embedding
      const embedding = await this.generateEmbedding(content);

      // Prepare vector for storage
      const vectorId = `${userId}_${taskId}_${uuidv4()}`;
      const vector = {
        id: vectorId,
        values: embedding,
        metadata: {
          userId,
          taskId,
          type,
          content: content.substring(0, 500), // Store first 500 chars
          timestamp: new Date().toISOString(),
          ...metadata
        }
      };

      // Store in Pinecone
      const response = await axios.post(
        `${this.baseUrl}/vectors/upsert`,
        {
          vectors: [vector],
          namespace: userId
        },
        {
          headers: {
            'Api-Key': this.apiKey,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        vectorId,
        embedding: embedding.length
      };
    } catch (error) {
      console.error('Memory storage failed:', error.message);
      throw error;
    }
  }

  /**
   * Retrieve similar memories using semantic search
   */
  async retrieveSimilarMemories(userId, query, limit = 5, threshold = 0.7) {
    try {
      // Generate query embedding
      const queryEmbedding = await this.generateEmbedding(query);

      // Search in Pinecone
      const response = await axios.post(
        `${this.baseUrl}/query`,
        {
          vector: queryEmbedding,
          topK: limit,
          namespace: userId,
          includeMetadata: true,
          filter: {
            'metadata.userId': { '$eq': userId }
          }
        },
        {
          headers: {
            'Api-Key': this.apiKey,
            'Content-Type': 'application/json'
          }
        }
      );

      // Filter by threshold
      const results = response.data.matches || [];
      return results.filter(r => r.score >= threshold).map(r => ({
        vectorId: r.id,
        similarity: r.score,
        metadata: r.metadata,
        content: r.metadata.content
      }));
    } catch (error) {
      console.error('Memory retrieval failed:', error.message);
      return [];
    }
  }

  /**
   * Batch store memories for efficiency
   */
  async storeMemoriesBatch(userId, memories) {
    try {
      const vectors = [];

      for (const memory of memories) {
        const embedding = await this.generateEmbedding(memory.content);
        const vectorId = `${userId}_${memory.taskId}_${uuidv4()}`;

        vectors.push({
          id: vectorId,
          values: embedding,
          metadata: {
            userId,
            taskId: memory.taskId,
            type: memory.type || 'interaction',
            content: memory.content.substring(0, 500),
            timestamp: new Date().toISOString(),
            ...memory.metadata
          }
        });
      }

      // Process in batches
      const results = [];
      for (let i = 0; i < vectors.length; i += this.batchSize) {
        const batch = vectors.slice(i, i + this.batchSize);
        
        const response = await axios.post(
          `${this.baseUrl}/vectors/upsert`,
          {
            vectors: batch,
            namespace: userId
          },
          {
            headers: {
              'Api-Key': this.apiKey,
              'Content-Type': 'application/json'
            }
          }
        );

        results.push({
          batchIndex: i / this.batchSize,
          stored: batch.length
        });
      }

      return {
        success: true,
        totalStored: vectors.length,
        batches: results
      };
    } catch (error) {
      console.error('Batch storage failed:', error.message);
      throw error;
    }
  }

  /**
   * Delete user's memories (for privacy)
   */
  async deleteUserMemories(userId) {
    try {
      const response = await axios.delete(
        `${this.baseUrl}/vectors/delete-by-filter`,
        {
          data: {
            filter: {
              'metadata.userId': { '$eq': userId }
            },
            namespace: userId
          },
          headers: {
            'Api-Key': this.apiKey,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        deletedCount: response.data.deletedCount
      };
    } catch (error) {
      console.error('Memory deletion failed:', error.message);
      throw error;
    }
  }

  /**
   * Get database statistics
   */
  async getStats(userId) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/describe_index_stats`,
        {
          namespace: userId
        },
        {
          headers: {
            'Api-Key': this.apiKey,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        namespace: userId,
        vectorCount: response.data.namespaces[userId]?.vectorCount || 0,
        dimension: response.data.dimension,
        indexFullness: response.data.indexFullness
      };
    } catch (error) {
      console.error('Stats retrieval failed:', error.message);
      return null;
    }
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
  }
}

module.exports = VectorDatabaseManager;
