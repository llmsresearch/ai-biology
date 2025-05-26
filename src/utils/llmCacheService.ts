export interface CacheEntry {
  prompt: string;
  messages: Array<{ role: string; content: string }>;
  response: string;
  timestamp: number;
  hash: string;
  provider: string;
  modelName: string;
}

class LLMCacheService {
  private cache: Map<string, CacheEntry> = new Map();
  private readonly CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours
  private readonly SIMILARITY_THRESHOLD = 0.85;
  private readonly MAX_CACHE_SIZE = 100;

  constructor() {
    this.loadCacheFromStorage();
  }

  // Generate a hash for cache key based on content
  private generateHash(prompt: string, messages: Array<{ role: string; content: string }>, provider: string, model: string): string {
    const content = JSON.stringify({ prompt, messages, provider, model });
    return btoa(content).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
  }

  // Simple similarity calculation using Jaccard similarity
  private calculateSimilarity(str1: string, str2: string): number {
    const normalize = (str: string) => str.toLowerCase().replace(/[^\w\s]/g, '').trim();
    const words1 = new Set(normalize(str1).split(/\s+/));
    const words2 = new Set(normalize(str2).split(/\s+/));
    
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    
    return intersection.size / union.size;
  }

  // Find similar cached entry
  private findSimilarEntry(prompt: string, messages: Array<{ role: string; content: string }>, provider: string, model: string): CacheEntry | null {
    const currentTime = Date.now();
    let bestMatch: CacheEntry | null = null;
    let bestSimilarity = 0;

    for (const entry of this.cache.values()) {
      // Skip expired entries
      if (currentTime - entry.timestamp > this.CACHE_EXPIRY_MS) {
        continue;
      }

      // Skip different providers/models
      if (entry.provider !== provider || entry.modelName !== model) {
        continue;
      }

      // Calculate similarity
      const promptSimilarity = this.calculateSimilarity(prompt, entry.prompt);
      const messagesSimilarity = this.calculateSimilarity(
        JSON.stringify(messages),
        JSON.stringify(entry.messages)
      );
      
      const avgSimilarity = (promptSimilarity + messagesSimilarity) / 2;
      
      if (avgSimilarity > this.SIMILARITY_THRESHOLD && avgSimilarity > bestSimilarity) {
        bestSimilarity = avgSimilarity;
        bestMatch = entry;
      }
    }

    return bestMatch;
  }

  // Get cached response
  getCachedResponse(prompt: string, messages: Array<{ role: string; content: string }>, provider: string, model: string): string | null {
    const hash = this.generateHash(prompt, messages, provider, model);
    
    // Try exact match first
    const exactMatch = this.cache.get(hash);
    if (exactMatch && Date.now() - exactMatch.timestamp <= this.CACHE_EXPIRY_MS) {
      console.log('✅ Cache hit (exact match):', hash);
      return exactMatch.response;
    }

    // Try similarity match
    const similarMatch = this.findSimilarEntry(prompt, messages, provider, model);
    if (similarMatch) {
      console.log('✅ Cache hit (similar match):', similarMatch.hash);
      return similarMatch.response;
    }

    console.log('❌ Cache miss:', hash);
    return null;
  }

  // Store response in cache
  setCachedResponse(prompt: string, messages: Array<{ role: string; content: string }>, response: string, provider: string, model: string): void {
    const hash = this.generateHash(prompt, messages, provider, model);
    const entry: CacheEntry = {
      prompt,
      messages,
      response,
      timestamp: Date.now(),
      hash,
      provider,
      modelName: model
    };

    this.cache.set(hash, entry);
    
    // Cleanup old entries if cache is too large
    this.cleanupCache();
    
    // Persist to storage
    this.saveCacheToStorage();
    
    console.log('💾 Cached response:', hash);
  }

  // Clean up expired and excess entries
  private cleanupCache(): void {
    const currentTime = Date.now();
    const entries = Array.from(this.cache.entries());
    
    // Remove expired entries
    for (const [hash, entry] of entries) {
      if (currentTime - entry.timestamp > this.CACHE_EXPIRY_MS) {
        this.cache.delete(hash);
      }
    }

    // Remove oldest entries if still too large
    if (this.cache.size > this.MAX_CACHE_SIZE) {
      const sortedEntries = Array.from(this.cache.entries())
        .sort(([,a], [,b]) => a.timestamp - b.timestamp);
      
      const entriesToRemove = sortedEntries.slice(0, this.cache.size - this.MAX_CACHE_SIZE);
      entriesToRemove.forEach(([hash]) => this.cache.delete(hash));
    }
  }

  // Load cache from localStorage
  private loadCacheFromStorage(): void {
    try {
      const stored = localStorage.getItem('llm-cache');
      if (stored) {
        const parsed: CacheEntry[] = JSON.parse(stored);
        parsed.forEach(entry => {
          // Only load non-expired entries
          if (Date.now() - entry.timestamp <= this.CACHE_EXPIRY_MS) {
            this.cache.set(entry.hash, entry);
          }
        });
        console.log(`📁 Loaded ${this.cache.size} cached entries from storage`);
      }
    } catch (error) {
      console.warn('Failed to load cache from storage:', error);
    }
  }

  // Save cache to localStorage
  private saveCacheToStorage(): void {
    try {
      const entries = Array.from(this.cache.values());
      localStorage.setItem('llm-cache', JSON.stringify(entries));
    } catch (error) {
      console.warn('Failed to save cache to storage:', error);
    }
  }

  // Clear all cache
  clearCache(): void {
    this.cache.clear();
    localStorage.removeItem('llm-cache');
    console.log('🗑️ Cache cleared');
  }

  // Get cache statistics
  getCacheStats(): { size: number; hitRate?: number; oldestEntry?: Date } {
    const entries = Array.from(this.cache.values());
    const oldestTimestamp = entries.length > 0 ? Math.min(...entries.map(e => e.timestamp)) : null;
    
    return {
      size: this.cache.size,
      oldestEntry: oldestTimestamp ? new Date(oldestTimestamp) : undefined
    };
  }
}

export const llmCacheService = new LLMCacheService(); 