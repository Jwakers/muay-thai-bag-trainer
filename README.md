# Muay Thai Bag Trainer

iOS-first Capacitor setup for running this Vite app as a native mobile app (not only as a PWA), with a fast local development workflow.

## Stack

- Web app: Vite + React
- Native wrapper: Capacitor
- App ID: `com.jackwakeham.muaythaibagtrainer`

Official reference: [Installing Capacitor | Capacitor Documentation](https://capacitorjs.com/docs/getting-started)

## Prerequisites

- Node + pnpm installed
- Xcode installed (for iOS simulator and iPhone builds)
- CocoaPods installed (`sudo gem install cocoapods`, if not already available)
- Apple Developer account + signing configured in Xcode for physical device installs

## One-time setup from clone

```bash
pnpm install
pnpm run cap:sync
pnpm run cap:open:ios
```

In Xcode the first time:

1. Select the `App` target.
2. Open **Signing & Capabilities**.
3. Choose your Team.
4. Confirm bundle id is `com.jackwakeham.muaythaibagtrainer`.
5. Build once to ensure provisioning is valid.

## Daily iOS development workflow

### Option A: Stable loop (recommended default)

Use this when you want predictable behavior that matches production packaging.

```bash
pnpm run cap:ios:update
```

This runs:

1. `vite build` (web assets)
2. `cap sync ios` (copies web assets into iOS project)
3. opens Xcode

Then press Run in Xcode (simulator or device).

### Option B: Fastest loop on physical iPhone (live reload over LAN)

Use this for rapid UI iterations without full rebuild+sync on every change.

1. Ensure Mac and iPhone are on the same Wi-Fi.
2. Start iOS live reload:

```bash
pnpm run cap:run:ios:live
```

This launches Vite with external access and runs the Capacitor iOS app pointed at your dev server.

Notes:

- Keep the terminal/dev server running while testing.
- If the device cannot connect, verify the local firewall and that both devices are on the same network segment.
- If networking is flaky, fall back to Option A.

## Simulator workflow

1. Run `pnpm run cap:ios:update`.
2. In Xcode, choose an iPhone simulator target.
3. Press Run.
4. Repeat `pnpm run cap:sync:ios` after code changes that need a new bundled build.

## Physical iPhone workflow

1. Connect iPhone (USB recommended for first trust/signing setup).
2. In iPhone settings, trust your developer certificate if prompted.
3. In Xcode, select your iPhone device target.
4. Press Run.
5. For iterative development, prefer:
   - `pnpm run cap:run:ios:live` for fastest feedback
   - `pnpm run cap:ios:update` for full asset refresh and production-like behavior

## Android scaffold (prepared, secondary)

Android project is generated and can be opened with:

```bash
pnpm run cap:open:android
```

Use `pnpm run cap:sync:android` after web changes.

## Useful scripts

- `pnpm run dev` - run web app only (browser)
- `pnpm run build` - production web build
- `pnpm run cap:sync` - build web + sync all native platforms
- `pnpm run cap:sync:ios` - build web + sync iOS
- `pnpm run cap:sync:android` - build web + sync Android
- `pnpm run cap:open:ios` - open Xcode workspace
- `pnpm run cap:open:android` - open Android Studio project
- `pnpm run cap:ios:update` - build+sync iOS then open Xcode
- `pnpm run cap:run:ios:live` - run iOS with live reload over LAN

## Troubleshooting

- Stale UI/assets in app:
  - run `pnpm run cap:sync:ios`, then rebuild from Xcode
- Provisioning/signing errors:
  - recheck Xcode Team, bundle id, and certificate trust on device
- Live reload not reachable on phone:
  - same Wi-Fi, no VPN split issues, local firewall allows node/vite
- Works in browser but not in native shell:
  - test again with Option A (`cap:ios:update`) to eliminate live-reload network issues
