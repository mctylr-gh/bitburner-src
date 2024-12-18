import React, { useState, useEffect } from "react";
import { EventEmitter } from "../../utils/EventEmitter";
import { Modal } from "./Modal";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { cyrb53 } from "../../utils/HashUtils";

export const AlertEvents = new EventEmitter<[string | JSX.Element]>();

interface Alert {
  text: string | JSX.Element;
  hash: string;
}

export function AlertManager({ hidden }: { hidden: boolean }): React.ReactElement {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  useEffect(
    () =>
      AlertEvents.subscribe((text: string | JSX.Element) => {
        const hash = getMessageHash(text);
        setAlerts((old) => {
          if (old.some((a) => a.hash === hash)) {
            return old;
          }
          return [
            ...old,
            {
              text: text,
              hash: hash,
            },
          ];
        });
      }),
    [],
  );

  useEffect(() => {
    function handle(this: Document, event: KeyboardEvent): void {
      if (event.code === "Escape") {
        setAlerts([]);
      }
    }
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, []);

  const alertMessage = alerts[0]?.text || "No alert to show";

  function getMessageHash(text: string | JSX.Element): string {
    if (typeof text === "string") {
      return cyrb53(text);
    }
    /**
     * JSON.stringify may throw an error in edge cases. One possible error is "TypeError: Converting circular structure
     * to JSON". It may happen in very special cases. This is the flow of one of them:
     * - An error occurred in GameRoot.tsx and we show a warning popup by calling "exceptionAlert" without delaying.
     * - "exceptionAlert" constructs a React element and passes it via "dialogBoxCreate" -> "AlertEvents.emit".
     * - When we receive the final React element here, the element's "props" property may contain a circular structure.
     */
    let textPropsAsString;
    try {
      textPropsAsString = JSON.stringify(text.props);
    } catch (e) {
      console.error(e);
      // Use the current timestamp as the fallback value.
      textPropsAsString = Date.now().toString();
    }
    return cyrb53(textPropsAsString);
  }

  function close(): void {
    setAlerts((old) => {
      return old.slice(1);
    });
  }

  return (
    <Modal open={!hidden && alerts.length > 0} onClose={close}>
      <Box overflow="scroll" sx={{ overflowWrap: "break-word", whiteSpace: "pre-line" }}>
        <Typography component={"span"}>{alertMessage}</Typography>
      </Box>
    </Modal>
  );
}
