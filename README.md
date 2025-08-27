# SoftLanding

> **A SerenityJS plugin that safely transfers players to fallback servers when the current server shuts down.**  
> No more hard crashes — give your players a smooth, soft landing.

---

## Getting Started

1. **Install the Plugin**: Add the `softlanding` plugin to your SerenityJS server's `plugins` directory.

2. **Configure the Plugin**: Create a `softlanding.json` file in the plugin directory:

```json
{
  "enabled": true,
  "fallbackList": [
    { "address": "play.fallback1.net", "port": 19132 },
    { "address": "play.fallback2.net", "port": 19132 }
  ],
  "pingFallbacks": true,
  "pingInterval": 10000
}
```

3. Start Your Server: Launch your SerenityJS server. SoftLanding will automatically manage player transfers when the server shuts down.

---

## Features

##### [Automatic Player Transfer]

Players are automatically redirected to a fallback server when the current server closes, ensuring a smooth experience.

##### [Fallback Server List]

Specify multiple fallback servers with addresses and ports. SoftLanding can optionally ping these servers to check availability before transferring players.

##### [Configurable Ping Intervals]

The plugin can periodically check fallback server availability with a customizable interval in milliseconds (pingInterval).

##### [Safe Shutdown Warnings]

Optional pre-transfer notifications can alert players before the server closes (if enabled in future versions).

##### [Lightweight & Easy]

Minimal setup required — just install, configure, and start your server.

##### Configuration Options

Option Type Description
enabled boolean Whether the plugin is enabled.
fallbackList array List of fallback server addresses and ports.
pingFallbacks boolean Whether to ping fallback servers to check availability.
pingInterval number Interval in milliseconds to ping fallback servers.

| Option        | Type    | Description                                             |
| ------------- | ------- | ------------------------------------------------------- |
| enabled       | boolean | Whether the plugin is enabled.                          |
| fallbackList  | array   | List of fallback server addresses and ports.            |
| pingFallbacks | boolean | Whether to ping fallback servers to check availability. |
| pingInterval  | number  | Interval in milliseconds to ping fallback servers.      |

## Notes

> Recommended pingInterval is at least 5000 ms (5 seconds).

> If all fallback servers are offline, players may still be disconnected.

> SoftLanding is designed to be fully automated — no extra commands required.
