/** @format */

import {
  ROLES,
  PROFESSION,
  PRONOUNS,
  AGE_RANGE,
  CHARACTER_TYPE,
  EMOTION_CONDITION,
  ETHNICITY,
  GENDER,
  GENRE,
  MEDIA_TYPE,
  ROLE_TYPE,
  CHARACTER_ACTIONS,
  LOCATION,
  TIME_PERIODS,
  CHARACTER_ARCHTYPE,
} from "../config/ENUM";
import validator from "./validator";

const available_on = [
  "acorn_tv",
  "allblk",
  "amc",
  "apple_tv",
  "asiancrush",
  "bet",
  "britbox",
  "broadwayhd",
  "chaiflicks",
  "cinemax",
  "criterion_channel",
  "cw_seed",
  "dekkoo",
  "discovery",
  "disney",
  "dove_channel",
  "dust",
  "eros_now",
  "fearless",
  "film_movement_plus",
  "filmbox",
  "google_play",
  "hallmark_movies_now",
  "hbo_max",
  "hi-yah",
  "hoopla",
  "hulu",
  "imdb_tv",
  "kanopy",
  "kocowa",
  "marquee_tv",
  "midnight_pulp",
  "netflix",
  "paramount",
  "peacock",
  "philo",
  "plex",
  "pluto_tv",
  "pure_flix",
  "rakuten_viki",
  "redbox_free_live_tv",
  "revry",
  "roku_channel",
  "screambox",
  "shudder",
  "showtime",
  "sling_tv",
  "starz",
  "sundance_now",
  "tubi",
  "vix",
  "vudu",
  "walter_presents",
  "youtube",
  "youtube_tv",
  "yupptv",
  "zee5",
];

const availableOnValidations = available_on.map((platform) => {
  return validator.objectValidationMW(`available_on.${platform}`, "boolean");
});

const userResiter = [
  validator.emailFieldValidationMW("email"),
  validator.requiredFieldValidationMW("email"),
  validator.requiredFieldValidationMW("full_name"),
  validator.passwordFieldValidationMW("password", 8),
  validator.enumSigunUpValidationMW("role", Object.values(ROLES)),
  validator.enumSigunUpValidationMW("profession", Object.values(PROFESSION)),
  validator.enumSigunUpValidationMW("ethnicity", Object.values(ETHNICITY)),
  validator.enumSigunUpValidationMW("gender", Object.values(GENDER)),
  validator.enumSigunUpValidationMW("pronouns", Object.values(PRONOUNS)),
  validator.enumSigunUpValidationMW("age_range", Object.values(AGE_RANGE)),
];
const signIn = [
  validator.emailFieldValidationMW("email"),
  validator.requiredFieldValidationMW("email"),
  validator.requiredFieldValidationMW("password"),
];

const forgotpassword = [
  validator.emailFieldValidationMW("email"),
  validator.requiredFieldValidationMW("email"),
];
const verifyForgetPassword = [
  validator.requiredFieldValidationMW("token"),
  validator.requiredFieldValidationMW("new_password"),
  validator.passwordFieldValidationMW("new_password", 8),
];
const updatepassword = [
  validator.passwordFieldValidationMW("current_password", 8),
  validator.passwordFieldValidationMW("new_password", 8),
];
const verifyEmail = [validator.requiredFieldValidationMW("token")];
const resetpassword = [
  validator.requiredFieldValidationMW("token"),
  validator.requiredFieldValidationMW("password"),
  validator.passwordFieldValidationMW("password", 8),
];

const contactUs = [validator.requiredFieldValidationMW("message")];

const addVideo = [
  // Required fields
  validator.requiredFieldValidationMW("clip_name"),
  validator.requiredFieldValidationMW("product_title"),
  validator.requiredFieldValidationMW("release_year"),
  validator.requiredFieldValidationMW("release_year"),
  validator.requiredFieldValidationMW("rating"),
  // validator.requiredFieldValidationMW("clip_link"),
  validator.requiredFieldValidationMW("description"),
  validator.requiredFieldValidationMW("genre"),
  validator.requiredFieldValidationMW("cast"),
  validator.requiredFieldValidationMW("tags"),
  validator.requiredFieldValidationMW("watch_for"),
  validator.requiredFieldValidationMW("time_stamp"),
  validator.requiredFieldValidationMW("clip_length"),
  validator.requiredFieldValidationMW("gender"),
  validator.requiredFieldValidationMW("age"),
  validator.requiredFieldValidationMW("race"),
  validator.requiredFieldValidationMW("media_type"),
  validator.requiredFieldValidationMW("role_type"),
  validator.requiredFieldValidationMW("arche_type"),
  validator.requiredFieldValidationMW("character_type"),
  validator.requiredFieldValidationMW("emotion_condition"),
  validator.requiredFieldValidationMW("location"),
  validator.requiredFieldValidationMW("actions"),

  // Type-specific validations
  validator.stringValidationMW("clip_name"),
  validator.stringValidationMW("product_title"),
  validator.stringValidationMW("rating"),
  // validator.urlFieldValidationMW("clip_link"),
  validator.stringValidationMW("description"),
  validator.stringValidationMW("watch_for"),
  validator.stringValidationMW("time_stamp"),
  validator.stringValidationMW("clip_length"),
  validator.stringValidationMW("product_title"),
  validator.stringValidationMW("location"),
  validator.stringValidationMW("rating"),
  validator.stringValidationMW("description"),
  validator.numberValidationMW("release_year"),
  validator.booleanFieldValidationMW("is_premium"),
  validator.booleanFieldValidationMW("is_draft"),

  // Array validations
  validator.arrayValidationMW("cast", "string"),
  validator.arrayValidationMW("tags", "string"),
  validator.arrayValidationMW("age", "string"),

  // Object validations

  ...availableOnValidations,
  // validator.objectValidationMW("available_on.amazon", "boolean"),

  // Enum validations
 validator.enumValidationMW("media_type", Object.values(MEDIA_TYPE)),
  validator.enumValidationMW("character_type", Object.values(CHARACTER_TYPE)),
  validator.enumValidationMW(
    "emotion_condition",
    Object.values(EMOTION_CONDITION)
  ),
  validator.enumValidationMW("actions", Object.values(CHARACTER_ACTIONS)),
  validator.enumValidationMW("actions", Object.values(CHARACTER_ACTIONS)),
  validator.enumValidationMW("gender", Object.values(GENDER)),
  validator.enumValidationMW("race", Object.values(ETHNICITY)),
  validator.enumValidationMW("location_type", Object.values(LOCATION)),
  validator.enumValidationMW("time_periods", Object.values(TIME_PERIODS)),
  validator.enumValidationMW("role_type", Object.values(ROLE_TYPE)),
  validator.enumValidationMW("arche_type", Object.values(CHARACTER_ARCHTYPE)),
  validator.enumValidationMW("genre", Object.values(GENRE)),
  validator.enumValidationMW(
    "emotion_condition",
    Object.values(EMOTION_CONDITION)
  ),
];
const updateVideo = [
  // Required fields
  validator.requiredFieldValidationMW("video_id"),
  validator.requiredFieldValidationMW("clip_name"),
  validator.requiredFieldValidationMW("product_title"),
  validator.requiredFieldValidationMW("release_year"),
  validator.requiredFieldValidationMW("release_year"),
  validator.requiredFieldValidationMW("rating"),
  // validator.requiredFieldValidationMW("clip_link"),
  validator.requiredFieldValidationMW("description"),
  validator.requiredFieldValidationMW("genre"),
  validator.requiredFieldValidationMW("cast"),
  validator.requiredFieldValidationMW("tags"),
  validator.requiredFieldValidationMW("watch_for"),
  validator.requiredFieldValidationMW("time_stamp"),
  validator.requiredFieldValidationMW("clip_length"),
  validator.requiredFieldValidationMW("gender"),
  validator.requiredFieldValidationMW("age"),
  validator.requiredFieldValidationMW("race"),
  validator.requiredFieldValidationMW("media_type"),
  validator.requiredFieldValidationMW("role_type"),
  validator.requiredFieldValidationMW("arche_type"),
  validator.requiredFieldValidationMW("character_type"),
  validator.requiredFieldValidationMW("emotion_condition"),
  validator.requiredFieldValidationMW("location"),
  validator.requiredFieldValidationMW("actions"),

  // Type-specific validations
  validator.stringValidationMW("clip_name"),
  validator.stringValidationMW("product_title"),
  validator.stringValidationMW("rating"),
  // validator.urlFieldValidationMW("clip_link"),
  validator.stringValidationMW("description"),
  validator.stringValidationMW("watch_for"),
  validator.stringValidationMW("time_stamp"),
  validator.stringValidationMW("clip_length"),
  validator.stringValidationMW("product_title"),
  validator.stringValidationMW("location"),
  validator.stringValidationMW("rating"),
  validator.stringValidationMW("description"),
  validator.numberValidationMW("release_year"),
  validator.booleanFieldValidationMW("is_premium"),
  validator.booleanFieldValidationMW("is_draft"),

  // Array validations
  validator.arrayValidationMW("cast", "string"),
  validator.arrayValidationMW("tags", "string"),
  validator.arrayValidationMW("age", "string"),

  // Object validations
  // validator.objectValidationMW("available_on.netflix", "boolean"),
  // validator.objectValidationMW("available_on.amazon", "boolean"),

  ...availableOnValidations,

  // Enum validations
  validator.enumValidationMW("media_type", Object.values(MEDIA_TYPE)),
  validator.enumValidationMW("character_type", Object.values(CHARACTER_TYPE)),
  validator.enumValidationMW(
    "emotion_condition",
    Object.values(EMOTION_CONDITION)
  ),
  validator.enumValidationMW("actions", Object.values(CHARACTER_ACTIONS)),
  validator.enumValidationMW("actions", Object.values(CHARACTER_ACTIONS)),
  validator.enumValidationMW("gender", Object.values(GENDER)),
  validator.enumValidationMW("race", Object.values(ETHNICITY)),
  validator.enumValidationMW("time_periods", Object.values(TIME_PERIODS)),
  validator.enumValidationMW("role_type", Object.values(ROLE_TYPE)),
  validator.enumValidationMW("arche_type", Object.values(CHARACTER_ARCHTYPE)),
  validator.enumValidationMW("genre", Object.values(GENRE)),
  validator.enumValidationMW(
    "emotion_condition",
    Object.values(EMOTION_CONDITION)
  ),
];
const subscriptionUpdate = [validator.requiredFieldValidationMW("amount")];
const searchLimit = [validator.requiredFieldValidationMW("freeSearches")];

//playlist
const addDeleteVideoPlaylist = [
  validator.requiredFieldValidationMW("playlist_id"),
  validator.requiredFieldValidationMW("video_id"),
];
const addUpdatePlaylist = [validator.requiredFieldValidationMW("name")];

//favourites
const favorites = [validator.requiredFieldValidationMW("video_id")];

const updateName = [validator.requiredFieldValidationMW("update_name")];
const updateNotification = [validator.booleanFieldValidationMW("notification")];

const blog = [
  validator.requiredFieldValidationMW("title"),
  validator.stringValidationMW("title"),
  validator.requiredFieldValidationMW("description"),
  validator.stringValidationMW("description"),
  
]

class validation {
  signup = [userResiter, validator.validationResultMW];
  signin = [signIn, validator.validationResultMW];
  verifyEmail = [verifyEmail, validator.validationResultMW];
  contactUs = [contactUs, validator.validationResultMW];
  forgotpassword = [forgotpassword, validator.validationResultMW];
  verifyForgetPassword = [verifyForgetPassword, validator.validationResultMW];
  updatepassword = [updatepassword, validator.validationResultMW];
  resetpassword = [resetpassword, validator.validationResultMW];
  subscriptionUpdate = [subscriptionUpdate, validator.validationResultMW];
  searchLimit = [searchLimit, validator.validationResultMW];
  addVideo = [addVideo, validator.validationResultMW];
  updateVideo = [updateVideo, validator.validationResultMW];
  addDeleteVideoPlaylist = [
    addDeleteVideoPlaylist,
    validator.validationResultMW,
  ];
  favorites = [favorites, validator.validationResultMW];
  addUpdatePlaylist = [addUpdatePlaylist, validator.validationResultMW];
  updateName = [updateName, validator.validationResultMW];
  updateNotification = [updateNotification, validator.validationResultMW];
  blog = [blog, validator.validationResultMW];
}

export default new validation();
