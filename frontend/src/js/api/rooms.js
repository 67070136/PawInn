import { ROOM_TYPES, availableRooms, validateDates } from "../demo.js";
import { readData } from "../storage.js";
export function listRooms(start, end) {
  if (start && end) validateDates(start, end);
  return ROOM_TYPES.map((type) => ({
    ...type,
    available:
      start && end ? availableRooms(readData(), type.id, start, end).length : 2,
  }));
}
