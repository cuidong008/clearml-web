import Convert from "ansi-to-html"

export function transformDateToPeriod(value: any) {
  let d

  if (Number.isInteger(value)) {
    d = new Date(value)
  } else {
    if (!(Date.parse(value) > 0)) {
      return value
    }
    if (!value.endsWith("+00:00")) {
      value = value + "+00:00"
    }
    d = new Date(value)
  }
  // let d            = this.convertUTCDateToLocalDate(new Date(value));
  const now = new Date()
  const seconds = Math.round(Math.abs((now.getTime() - d.getTime()) / 1000))
  const timeToUpdate = Number.isNaN(seconds)
    ? 1000
    : getSecondsUntilUpdate(seconds) * 1000
  const minutes = Math.round(Math.abs(seconds / 60))
  const hours = Math.round(Math.abs(minutes / 60))
  const days = Math.round(Math.abs(hours / 24))
  const months = Math.round(Math.abs(days / 30.416))
  const years = Math.round(Math.abs(days / 365))
  if (Number.isNaN(seconds)) {
    return ""
  } else if (seconds <= 45) {
    return "a few seconds ago"
  } else if (seconds <= 90) {
    return "a minute ago"
  } else if (minutes <= 45) {
    return minutes + " minutes ago"
  } else if (minutes <= 90) {
    return "an hour ago"
  } else if (hours <= 22) {
    return hours + " hours ago"
  } else if (hours <= 36) {
    return "a day ago"
  } else if (days <= 25) {
    return days + " days ago"
  } else if (days <= 45) {
    return "a month ago"
  } else if (days <= 345) {
    return months + " months ago"
  } else if (days <= 545) {
    return "a year ago"
  } else {
    // (days > 545)
    return years + " years ago"
  }
}

function getSecondsUntilUpdate(seconds: number) {
  const min = 60
  const hr = min * 60
  const day = hr * 24
  if (seconds < min) {
    // less than 1 min, update every 2 secs
    return 2
  } else if (seconds < hr) {
    // less than an hour, update every 30 secs
    return 30
  } else if (seconds < day) {
    // less then a day, update every 5 mins
    return 300
  } else {
    // update every hour
    return 3600
  }
}

function convertUTCDateToLocalDate(date: Date) {
  if (date) {
    const newDate = new Date(
      date.getTime() + date.getTimezoneOffset() * 60 * 1000,
    )
    const offset = date.getTimezoneOffset() / 60
    const hours = date.getHours()
    newDate.setHours(hours - offset)
    return newDate
  }
  return
}

function ansiRegex({ onlyFirst = false } = {}) {
  const pattern = [
    "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
    "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))",
  ].join("|")

  return new RegExp(pattern, onlyFirst ? undefined : "g")
}

const regex = ansiRegex({ onlyFirst: true })

export function hasAnsi(string: string) {
  return regex.test(string)
}

export const ansiConvert = new Convert()
