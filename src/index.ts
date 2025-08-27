import { Plugin, PluginEvents, PluginType } from "@serenityjs/plugins";
import { ServerEvent } from "@serenityjs/core";
import { statusBedrock } from "minecraft-server-util";
import fs from "fs";
import { join } from "path";
import { Config } from "./types";
import { DisconnectReason } from "@serenityjs/protocol";

const defaultConfig: Config = {
  enabled: true,
  fallbackList: [],
  pingFallbacks: true,
  pingInterval: 60000,
};

let config: Config;
let availableFallback: { address: string; port: number } | undefined;
let pingInterval: NodeJS.Timeout | undefined;

class SoftLanding extends Plugin implements PluginEvents {
  public readonly type = PluginType.Addon;

  public constructor() {
    super("softlanding", "1.0.0");

    // Set the logger properties
    this.logger.name = "SoftLanding";
  }

  public onInitialize(): void {
    config = this.getConfig();

    this.logger.info(`§7SoftLanding Initialized. Version: ${this.version}`);
    this.logger.info(
      `§7SoftLanding: ${config.enabled ? "§aEnabled" : "§cDisabled"}`
    );

    if (config.fallbackList.length === 0)
      return this.logger.warn(`No Fallback Servers Provided`);

    if (!config.enabled) return;
    if (config.pingFallbacks) {
      this.checkFallbacks();
      pingInterval = setInterval(
        this.checkFallbacks.bind(this),
        config.pingInterval
      );
    }

    this.serenity.on(ServerEvent.Stop, this.onClose.bind(this));
  }

  public onShutDown(_plugin: Plugin): void {
    this.clearPingInterval();
  }

  /**
   * Clears the ping interval if it is set.
   */
  public clearPingInterval() {
    if (pingInterval) {
      clearInterval(pingInterval);
      pingInterval = undefined;
    }
  }

  /**
   * Runs When The Server Closes
   */
  public onClose() {
    this.clearPingInterval();
    if (availableFallback || !config.pingFallbacks) {
      const server = availableFallback
        ? availableFallback
        : config.fallbackList[0]!;
      for (const player of this.serenity.players.values())
        player.transfer(server.address, server.port);
    } else
      for (const player of this.serenity.players.values())
        player.disconnect(
          "All fallback servers failed.",
          DisconnectReason.Disconnected
        );
  }

  /**
   * Checks for a valid/available fallback server.
   */
  public async checkFallbacks() {
    availableFallback = undefined;

    for (const server of config.fallbackList) {
      try {
        const res = await statusBedrock(server.address, server.port);
        if (res && res.players.online < res.players.max) {
          availableFallback = server;
          this.logger.debug(
            `Found available fallback server: ${server.address}:${server.port}`
          );
          break;
        }
      } catch (error: any) {
        this.logger.debug(
          `Failed to ping fallback server ${server.address}:${server.port}. Error: ${error.message}`
        );
      }
    }
  }

  /**
   * Gets the plugin config, or makes one
   * @returns config
   */
  public getConfig(): Config {
    const configPath = join(this.path, "../../softlanding.config.json");
    if (!fs.existsSync(configPath)) {
      this.logger.info("Config file not found, creating default config.");
      fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
      return defaultConfig;
    }

    const configData = fs.readFileSync(configPath, "utf-8");
    try {
      const userConfig = JSON.parse(configData);
      return { ...defaultConfig, ...userConfig };
    } catch (error) {
      this.logger.error("Failed To Parse Config, resetting. Error:", error);
      fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
      return defaultConfig;
    }
  }
}

// Export the plugin instance
export default new SoftLanding();
