import { format } from "date-fns";

export function formatTime(fmt: string): string {
  try {
    return format(Date.now(), fmt);
  } catch (e: unknown) {
    return "formatTime error";
  }
}
