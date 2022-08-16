import { useEffect, useState } from "react";
import { EventsOff, EventsOn } from "../wailsjs/runtime/runtime";
import sound from "./assets/audio/timer-notification.mp3";

export const NotificationProvider = (props: { children: React.ReactNode }) => {
  const [error, setError] = useState("");

  useEffect(() => {
    EventsOn("notification_sound", (type) => {
      if (type === "timer_finished") {
        try {
          new Audio(sound).play();
        } catch (err) {
          setError(err + "");
        }
      }
    });

    return () => EventsOff("notification_sound");
  }, []);

  return (
    <>
      {error}
      {props.children}
    </>
  );
};
