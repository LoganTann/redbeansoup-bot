export function snowflakeToTimestamp(id: bigint) {
  return Number(id / 4194304n + 1420070400000n);
}

export enum DiscordTimestampFlag {
  relative = 'R',
  time = 't',
  date = 'd',
  datetime = 'f',
};

/**
 * https://discord.com/developers/docs/reference#message-formatting-timestamp-styles
 * @param date the Date object to encode
 * @param DiscordTimestampFlag the timestamp flag (relative, time, date)
 * @returns the discord timestamp tag of the date
 */
export function dateToDiscordTimestamp(date: Date, flag: DiscordTimestampFlag): string {
  return `<t:${(new Date(date).getTime() / 1000).toFixed(0)}:${flag}>`;
}

/**
 * Pseudonymizes a name
 * @param enseignant The full name to pseudonymize
 * @returns only the uppercase letters, each followed by a dot. It also won't remove the spaces.
 */
export function pseudonymizeTeacher(enseignant: string): string {
  return enseignant.replace(/([A-Z][a-z]{1,2})[^A-Z ]+/g, "$1.");
}

/**
 * Given a dictionnary {key: regex}[] defined inside the function, searchs for matches and replaces by the object key.
 * @param str the string to abbreviate
 * @returns the string where all matching words are abbreviated
 */
export function abbreviateBlockList(str: string): string {
  const dict = {
    "Amphi": /AMPHITHEATRE/i,
    "": /OLYMPE DE /i,
    "<à distance>": /^\d+$/,
  }
  for (const key in dict) {
    str = str.replace(dict[key], key);
  }
  return str;
}