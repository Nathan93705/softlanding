export interface Config {
  /**
   * Whether the plugin is enabled
   */
  enabled: boolean;

  /**
   * A list of fallback server addresses
   */
  fallbackList: {
    address: string;
    port: number;
  }[];

  /**
   * Whether to ping fallback servers, to check their availability
   */
  pingFallbacks: boolean;

  /**
   * The interval at which to ping fallback servers (in milliseconds)
   */
  pingInterval: number;
}
