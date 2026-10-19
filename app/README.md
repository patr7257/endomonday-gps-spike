# GPS Spike

Throwaway Capacitor 7 app that tests whether GPS keeps flowing with the screen locked for 10+ minutes, signed with a free Apple ID via Sideloadly.

Choice: `ios/` is NOT committed. CI runs `npx cap add ios` (needs CocoaPods on macOS, so not reliable on Windows), patches Info.plist with PlistBuddy (UIBackgroundModes=location plus the three location usage strings), then builds unsigned and packages `GPS-Spike.ipa`.

Capacitor 7 is pinned (not 8) because the community plugin has no Swift Package manifest, and Capacitor 7 defaults to CocoaPods.
