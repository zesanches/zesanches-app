---
title: "The checklist that disappeared offline"
date: "2026-11-26"
excerpt: "The last step was saved on the device, but the screen waited for the API to show it as pending. What that bug taught us about local queues, upload retries, and testing in airplane mode."
tags: ["React Native", "Mobile", "Offline", "Synchronization"]
author: "José Sanches"
---

An operator completed two of the three steps in an inspection checklist while online. Then they turned off Wi-Fi and mobile data, filled in the third step, and tapped **Finish step**. The app returned to the appointments list without a message. The card was still tappable, and reopening the checklist showed a blank final step. The connection came back, and the checklist still sat unsent.

The same steps reproduced the problem every time. The product rule was that losing connectivity must never cost the operator an inspection. We checked the queue saved on the device. The third step was there, with its answers. The screen gave the operator every reason to start over even though the app had already saved their work.

In a yard, a metal warehouse, or a loading bay, losing connectivity is part of the shift. Repeating twenty minutes of inspection work costs time and can leave gaps in the operational record. For field apps, preserving work includes showing where it was saved and what still needs to reach the server.

## How much of the app needs to work offline?

That depends on what users need to finish on site. For some workflows, reading the last downloaded list is enough. An inspection requires recording answers, photos, and sometimes signatures. Think of these levels as a range of product choices.

| Support | What works without a connection |
| --- | --- |
| Online-only | Operations that require real-time communication are unavailable. |
| Read cache | Users can read the last downloaded copy. |
| Offline-tolerant | Users can make changes, and a persisted queue holds what needs to be sent. |
| Offline-first | The app reads from a local database, and synchronization updates that data source. |
| Local-first | Users retain control of their data and can work with their local copies. Techniques such as CRDTs can help reconcile collaborative edits. |

Our app was at the third level. Operators could record a step offline once they were in the inspection flow. The fix brought a principle from the fourth level to the appointments screen. Upload status started following the queue on the device. [Android's offline-first guide](https://developer.android.com/topic/architecture/data-layer/offline-first) · [Local-first software, Ink & Switch](https://www.inkandswitch.com/essay/local-first/)

## From a completed step to the server

Each completed step went into a Redux outbox. Redux Persist wrote the queue to AsyncStorage. The operator tapped **Upload**, and the app worked through the queue one item at a time. Failures were handled per item, so the failed entry stayed available for a retry while the rest of the queue moved on. [Redux Persist documentation](https://github.com/endograph/redux-persist)

```text
Finish step → Redux queue → AsyncStorage
                                ↓
                      Operator taps “Upload”
                                ↓
                            Send answers
                                ↓
                      Save checkpoint on device
                                ↓
                       Upload photos in batches
                                ↓
                      Server confirms completion
                                ↓
                          Remove from queue
```

For a small queue, saving structured data as JSON in a key-value store is a straightforward choice. The serialized size matters because in this design, updating the queue rewrites its JSON. When the app needs to query many records, use indexes, or sync only what changed, SQLite starts to make more sense. The team also takes on schema migrations between app releases.

The checklist kept photos as files on the device and stored only their paths in the queue. Compression and batched multipart uploads happened at upload time. The files have to remain available while an upload is pending. Session credentials used protection provided by the Android Keystore. On iOS, Keychain serves that role for application secrets. Answers, photos, and signatures also deserve an assessment based on how sensitive the data left on the device is. [OWASP MASVS secure storage control](https://mas.owasp.org/MASVS/controls/MASVS-STORAGE-1/)

### When answers go through and photos fail

If the connection drops while the photos are uploading, the next attempt can start with the photos. The checkpoint records that the answers were confirmed. In an earlier bug, the app checked that checkpoint in several places, but the upload flow never wrote it. Every retry sent the same answers, received HTTP 422, and failed before it reached the photos.

There is still a gap between the server accepting an operation and the device receiving the confirmation. If the confirmation gets lost, the local checkpoint alone leaves the client unsure whether it can safely try again. When the API supports idempotency, the client can reuse the same key for the same operation, and the server can recognize a repeat. A genuine conflict calls for an explicit decision. If the server confirms that this item was already completed, the queue can move on. If an incompatible edit exists, the interface needs to show the rejection and preserve what users need to resolve it. A generic `422` alone cannot tell you which case you are in. [Idempotent requests, Stripe](https://docs.stripe.com/api/idempotent_requests)

## Why did the list show a blank step?

The **Pending checklists** dialog, the **Awaiting sync** badge, and the disabled state of the card all read a copy of the queue held in screen state. That copy refreshed when the appointments list from the API changed. In airplane mode, the step went into the queue and the card had nothing to trigger its update.

| Moment | What the operator saw | What the device held |
| --- | --- | --- |
| Finished the third step | The appointments list, without a message | The step was in the queue. |
| Reopened the card | A blank third step | The answers were still saved. |
| Regained connectivity | No indication that an upload was needed | The step was waiting for a manual upload. |

Other details made the failure persist. The list fallback looked up the key `schedule`, while the write used `Schedule`. When the routine managed to read the queue, it decided whether to open the dialog using the state from before `setState`. On startup without a connection, the routine could also run before the screen filters were ready. Online, the arrival of the appointments list triggered another read and could mask those problems.

Airplane mode exposed a separate failure further up the flow. For steps that required a signature, the WebView downloaded `signature_pad` from a CDN. Without the script, drawing failed and tapping **Sign** did nothing. The saved step exposed a problem in how the screen represented the queue. The signature bug meant the operator could get stuck before even completing a step.

## What changed in the hotfix

### The screen started following the queue

The routine that matches pending work to appointments started reacting to the persisted queue, the available list, and the screen filters. The card reflects a completed step as soon as it enters Redux, and the routine can run again when the filters are ready. In this simplified example, the dialog and the card derive their status from the same queue.

```ts
const pending = useAppSelector(selectAnsweredSchedules)
const hasPending = (pending?.length ?? 0) > 0
const awaitingSync =
  pending?.some(item => item.scheduleId === scheduleId) ?? false
```

### The dialog started using the queue it had just read

The fallback reads from disk only while the queue is still absent from Redux. The same read also determines whether any work is pending. That decision is independent of when React applies the state update.

```ts
const resolved = answeredSchedules ?? (await readPendingFromDisk())
setPendingSchedules(resolved ?? [])
setPendingModalOpen((resolved?.length ?? 0) > 0)
```

In Redux, **`null` means “not loaded from disk yet”** and **`[]` means “loaded and empty.”** Once the last upload is confirmed, `[]` is a valid result. Treating an empty queue as missing data can make a disk read bring back an older copy of an item that was already sent.

### The network failure got an explanation

When the appointments request fails without an HTTP response and work is still in the queue, the app tells the operator that the checklist was saved on the device. A request without a response could mean airplane mode, a captive portal, a timeout, or an unreachable server. The hotfix message mentions a missing internet connection. The app can establish that it received no response from the server and that the step is still saved. The example translates the original message. [Axios error handling](https://axios.rest/pages/advanced/error-handling)

```ts
const toastId = 'schedules-offline-pending'

if (!hasHttpResponse(error) && hasPending && !toast.isOpen(toastId)) {
  toast.show(
    'No internet connection. The checklist was saved on this device and can be sent when the connection returns.',
    { id: toastId, type: 'warning' },
  )
}
```

The app's toast library opened another notification when we repeated `show` with the same `id`. Checking `isOpen` prevents a duplicate while the first toast is visible. After it closes, the card's badge keeps the pending status visible. A full synchronization flow can also distinguish **uploading**, **uploaded**, and **failed, try again**.

### The signature script started loading from the app

We embedded the same `signature_pad` 1.5.3 script in the WebView HTML and preserved its MIT license header. We verified the `sha512` of the official npm package and compared the script byte for byte with the CDN copy. Since the code would sit inside a template literal and a `<script>` tag, we also checked for sequences such as `</script`, backticks, and `${`. The bundle grew by about 6 KB, and updating the library became an explicit app change. [Signature Pad repository](https://github.com/szimek/signature_pad)

```diff
- <script src="https://cdnjs.cloudflare.com/ajax/libs/signature_pad/1.5.3/signature_pad.min.js"></script>
+ <script>${SIGNATURE_PAD_SCRIPT}</script>
```

## What airplane mode verified

We wrote five automated scenarios for the appointments list. Three failed before the fix because the pending dialog or toast did not appear. The other two covered the online path and the offline path with an empty queue. For the signature flow, one test checks for any HTTP or HTTPS `src` or `href` in the generated HTML. Another runs the embedded script with `vm.runInNewContext` and checks that it defines the `SignaturePad` constructor.

On an emulator in airplane mode, we completed a checklist with signatures from both the inspector and the driver. After reconnecting, we started the upload and checked both signatures in the PDF generated by the server. That test covered drawing in the WebView, completing the step offline, and uploading it later.

In a React Native development build, turning off the network can also cut the connection to Metro. On Android, we used `adb reverse tcp:8081 tcp:8081` and pointed the app at `localhost:8081`. ADB forwards the port through its own transport, such as USB or the emulator's local connection. The app could load the bundle with the device's network disabled. [React Native, running on a device](https://reactnative.dev/docs/running-on-device#method-1-using-adb-reverse-recommended)

## What remains

The hotfix fit inside the app and required no new dependency or API contract change. Upload stayed manual. On returning to the screen or refreshing the list, the operator can find the pending job and start the upload. A NetInfo listener could trigger an attempt on reconnection. For persistent background work, Android has WorkManager and iOS has BackgroundTasks, with execution subject to the system's conditions. With any of these approaches, the request outcome still determines whether the upload was confirmed. [NetInfo](https://github.com/react-native-netinfo/react-native-netinfo) · [WorkManager](https://developer.android.com/develop/background-work/background-tasks/persistent) · [BackgroundTasks](https://developer.apple.com/documentation/backgroundtasks)

The initial list of sites still needs a connection. If someone reopens the app offline, the queue remains on the device, but that screen can keep the operator from reaching the appointments. The `schedule` and `Schedule` key mismatch was recorded as technical debt, and inspection data still uses regular storage without application-level encryption. This fix made saved steps visible and restored signatures within the inspection flow.

## A checklist for your app

- [ ] Can users open and complete the necessary workflow in airplane mode, even after closing and reopening the app?
- [ ] Does the UI read pending status from local state and distinguish a queue that has yet to load from an empty queue?
- [ ] Does removing a completed item from the queue require confirmation from the server?
- [ ] Can a checkpoint resume an interrupted upload? Can the server recognize a repeat if the confirmation gets lost?
- [ ] Does a failed item let the rest of the batch proceed? Do permanent rejections leave the retry loop and stay visible for resolution?
- [ ] Does state store only the media paths, with the files kept until upload completes?
- [ ] Do essential WebViews, fonts, maps, and images work without external requests? Would a test catch the return of a remote dependency?
- [ ] Do credentials use secure storage, and do answers, photos, and signatures get the protection they need?
- [ ] Does the message say what happened, what was saved, and how to finish the upload?

**Saving data offline is the easy part. The hard part is making sure the app keeps telling the truth about that data while it has no connection.**
