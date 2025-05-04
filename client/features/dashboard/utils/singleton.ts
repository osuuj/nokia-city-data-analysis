/**
 * Creates a singleton factory for a given class
 * This avoids duplicating singleton implementation across services
 *
 * @template T The type of the singleton class
 * @param Factory The constructor function for the singleton
 * @returns A function that returns the singleton instance
 *
 * @example
 * // Define your service class
 * class MyService {
 *   // Service implementation...
 * }
 *
 * // Create a singleton getter
 * export const getMyService = createSingleton(MyService);
 *
 * // Use it in your application
 * const myService = getMyService();
 */
export function createSingleton<T>(Factory: new () => T): () => T {
  let instance: T | null = null;

  return () => {
    if (!instance) {
      instance = new Factory();
    }
    return instance;
  };
}
