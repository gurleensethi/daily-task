export function timeNumToDisplayStr(num: number): string {
  let numSeconds = num / 1000;

  const hours = Math.floor(numSeconds / 3600);
  numSeconds = numSeconds - 3600 * hours;

  const minutes = Math.floor(numSeconds / 60);
  numSeconds = numSeconds - 60 * minutes;

  let displayStr = "";

  if (hours > 0) {
    displayStr += String(hours) + " hr";
    if (hours > 1) {
      displayStr += "s";
    }
  }

  if (minutes > 0 || hours > 0) {
    displayStr += " " + String(minutes) + " min";
    if (minutes > 1) {
      displayStr += "s";
    }
  }

  if (numSeconds > 0 || minutes > 0 || hours > 0) {
    displayStr += " " + String(Math.floor(numSeconds)) + " sec";
    if (numSeconds > 1) {
      displayStr += "s";
    }
  }

  return displayStr;
}
