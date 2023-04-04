export const BASE_REGEX = {
  DOMAIN:
    "([A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?\\.)+([A-Za-z]{2,6}\\.?|[A-Za-z0-9-]{1,}[A-Za-z0-9]\\.?)",
  PATH: "(\\/?|[\\/?]\\S+)",
  IPV4: "\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}",
  IPV6: "\\[?[A-F0-9]*:[A-F0-9:]+\\]?",
  FILE_PROTOCOL: "[fF][iI][lL][eE]:\\/\\/",
  S3_PROTOCOL: "[sS]3:\\/\\/",
  GS_PROTOCOL: "[gG][sS]:\\/\\/",
  AZURE_PROTOCOL: "azure:\\/\\/",
  SCHEME: "^[hH][tT][tT][pP][sS]?:\\/\\/",
  FILE_SUFFIX: "\\/\\S*[^\\/ ]+$",
  FOLDER: "\\/\\S*[^\\/ ]",
  S3_BUCKET_NAME:
    "(?!(xn--|.+-s3alias$|.*\\.{2}.*))[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]",
  GS_BUCKET_NAME: "(\\w[A-Za-z0-9\\-_]+\\w\\.)*\\w[A-Za-z0-9\\-_]+\\w",
  AZURE_BUCKET_NAME: "(\\w[A-Za-z0-9\\-_]+\\w\\.)*\\w[A-Za-z0-9\\-_]+\\w",
}

export const URI_REGEX = {
  S3_WITH_BUCKET:
    BASE_REGEX.S3_PROTOCOL + BASE_REGEX.S3_BUCKET_NAME + BASE_REGEX.PATH,
  GS_WITH_BUCKET:
    BASE_REGEX.GS_PROTOCOL + BASE_REGEX.GS_BUCKET_NAME + BASE_REGEX.PATH,
  S3_WITH_BUCKET_AND_HOST:
    BASE_REGEX.S3_PROTOCOL +
    BASE_REGEX.S3_BUCKET_NAME +
    BASE_REGEX.DOMAIN +
    BASE_REGEX.PATH,
  GS_WITH_BUCKET_AND_HOST:
    BASE_REGEX.GS_PROTOCOL +
    BASE_REGEX.GS_BUCKET_NAME +
    BASE_REGEX.DOMAIN +
    BASE_REGEX.PATH,
  AZURE_WITH_BUCKET_AND_HOST:
    BASE_REGEX.AZURE_PROTOCOL +
    BASE_REGEX.AZURE_BUCKET_NAME +
    BASE_REGEX.DOMAIN +
    BASE_REGEX.PATH,
  NON_AWS_S3:
    BASE_REGEX.S3_PROTOCOL +
    "(" +
    BASE_REGEX.DOMAIN +
    "|" +
    "(localhost|LOCALHOST)" +
    BASE_REGEX.IPV4 +
    "|" +
    BASE_REGEX.IPV6 +
    ")" +
    "(:\\d+)?\\/" + // optional port.
    BASE_REGEX.S3_BUCKET_NAME +
    BASE_REGEX.PATH,
  HTTP:
    BASE_REGEX.SCHEME +
    "(" +
    BASE_REGEX.DOMAIN +
    "|" +
    "(localhost|LOCALHOST)|" +
    BASE_REGEX.IPV4 +
    "|" +
    BASE_REGEX.IPV6 +
    ")" +
    "(:\\d+)?",
  FILE: BASE_REGEX.FILE_PROTOCOL + BASE_REGEX.FOLDER,
  FILE_WITH_FILE_NAME:
    BASE_REGEX.FILE_PROTOCOL +
    "(" +
    BASE_REGEX.FOLDER +
    ")?" +
    BASE_REGEX.FILE_SUFFIX,
}

export const TASK_TYPES = {
  TRAINING: "training",
  ANNOTATION: "annotation",
  MANUAL_ANNOTATION: "annotation_manual",
  TESTING: "testing",
}

const recentTasksPrefix = "RECENT_TASKS"

export const RECENT_TASKS_ACTIONS = {
  GET_RECENT_TASKS: recentTasksPrefix + "GET_RECENT_TASKS",
  SET_RECENT_TASKS: recentTasksPrefix + "SET_RECENT_TASKS",
}

export const VIEW_PREFIX = "VIEW_"

export type MediaContentTypeEnum =
  | "image/bmp"
  | "image/jpeg"
  | "image/png"
  | "video/mp4"

export const MEDIA_VIDEO_EXTENSIONS = [
  "flv",
  "avi",
  "mp4",
  "mov",
  "mpg",
  "wmv",
  "3gp",
  "mkv",
]

export type MessageSeverityEnum = "success" | "error" | "info" | "warn"

export const MESSAGES_SEVERITY = {
  SUCCESS: "success" as MessageSeverityEnum,
  ERROR: "error" as MessageSeverityEnum,
  INFO: "info" as MessageSeverityEnum,
  WARN: "warn" as MessageSeverityEnum,
}

export const USERS_PREFIX = "USERS_"
export const USERS_ACTIONS = {
  FETCH_CURRENT_USER: USERS_PREFIX + "FETCH_USER",
  SET_CURRENT_USER: USERS_PREFIX + "SET_CURRENT_USER",
  LOGOUT_SUCCESS: USERS_PREFIX + "LOGOUT_SUCCESS",
  LOGOUT: USERS_PREFIX + "LOGOUT",
  SET_PREF: USERS_PREFIX + "SET_PREF",
}

export const NAVIGATION_PREFIX = "NAVIGATION_"
export const NAVIGATION_ACTIONS = {
  NAVIGATE_TO: NAVIGATION_PREFIX + "NAVIGATE_TO",
  NAVIGATION_END: NAVIGATION_PREFIX + "NAVIGATION_END",
  SET_ROUTER_SEGMENT: NAVIGATION_PREFIX + "SET_ROUTER_SEGMENT",
  UPDATATE_CURRENT_URL_WITHOUT_NAVIGATING:
    NAVIGATION_PREFIX + "UPDATATE_CURRENT_URL_WITHOUT_NAVIGATING",
  NAVIGATION_SKIPPED: NAVIGATION_PREFIX + "NAVIGATION_SKIPPED",
}

export const AUTO_REFRESH_INTERVAL = 10 * 1000

export const urls = {
  WEB_SERVER_URL: "",
  API_BASE_URL: "",
  FIlE_SERVER_URL: "",
}
