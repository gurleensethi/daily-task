import { useEffect } from "react";
import { EventsOff, EventsOn } from "../wailsjs/runtime/runtime";

export const NotificationProvider = (props: { children: React.ReactNode }) => {
  useEffect(() => {
    EventsOn("notification_sound", (type) => {
      if (type === "timer_finished") {
        new Audio("/src/assets/audio/timer-notification.mp3").play();
      }
    });

    return () => EventsOff("notification_sound");
  }, []);

  return <>{props.children}</>;
};
