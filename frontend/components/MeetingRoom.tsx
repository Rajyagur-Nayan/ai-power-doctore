"use client";

import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { useCallback, useRef } from "react";

export default function MeetingRoom({
  token,
  onLeave,
}: {
  token: string;
  roomName: string;
  onLeave: () => void;
}) {
  const serverUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;
  const containerRef = useRef<HTMLDivElement>(null);

  if (!serverUrl || !token) {
    return (
      <div className="flex items-center justify-center h-full p-4 text-red-500 bg-red-50 rounded-lg">
        <p>
          LiveKit Next.js environment variables (NEXT_PUBLIC_LIVEKIT_URL)
          missing or token not generated.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-[600px] border rounded-lg overflow-hidden relative shadow-lg"
    >
      <LiveKitRoom
        video={false} // Users connect with video/audio initially turned off. The control bar will allow them to enable it.
        audio={true}
        token={token}
        serverUrl={serverUrl}
        connect={true}
        // Extremely low bandwidth optimization settings
        options={{
          adaptiveStream: true, // Enables adaptive bitrate
          dynacast: true, // Pause offscreen videos dynamically
          publishDefaults: {
            // Simulcast allows multiple quality layers to be uploaded so poor bandwidth users can pull the lower quality ones
            simulcast: true,
          },
          videoCaptureDefaults: {
            resolution: { width: 320, height: 240, frameRate: 10 },
          },
        }}
        // Disconnecting handler
        onDisconnected={onLeave}
        onConnected={() => {
          // Programmatically click the chat toggle button to ensure the chat pane opens by default
          // Use an interval to poll until the chat is verified to be open (aria-pressed='true')
          let attempts = 0;
          const checkInterval = setInterval(() => {
            attempts++;
            if (containerRef.current) {
              const chatToggle = containerRef.current.querySelector(
                ".lk-chat-toggle",
              ) as HTMLButtonElement | null;
              if (chatToggle) {
                if (chatToggle.getAttribute("aria-pressed") === "true") {
                  // chat is verified open
                  clearInterval(checkInterval);
                } else {
                  // chat is closed, attempt to open
                  chatToggle.click();
                }
              }
            }
            if (attempts > 50) clearInterval(checkInterval); // give up after 25 seconds
          }, 500);
        }}
        data-lk-theme="default"
        className="w-full h-full"
      >
        <VideoConference />
        <RoomAudioRenderer />
      </LiveKitRoom>
    </div>
  );
}
