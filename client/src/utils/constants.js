export const HOST = "http://localhost:3001"

//////////////////////////////  AUTH  ////////////////////////////////
export const AUTH_ROUTES = "/api/auth";
export const SIGNUP_ROUTES = `${AUTH_ROUTES}/signup`
export const LOGIN_ROUTES = `${AUTH_ROUTES}/login`
export const GET_USER_INFO = `${AUTH_ROUTES}/user-info`
export const UPDATE_PROFILE_ROUTE = `${AUTH_ROUTES}/update-profile`
export const ADD_PROFILE_IMAGE = `${AUTH_ROUTES}/add-profile-image`
export const REMOVE_PROFILE_IMAGE = `${AUTH_ROUTES}/remove-profile-image`
export const LOGOUT_ROUTE = `${AUTH_ROUTES}/logout`


//////////////////////////////  CONTACT  ////////////////////////////////
export const CONTACTS_ROUTES = `/api/contacts`
export const SEARCH_CONTACTS_ROUTES = `${CONTACTS_ROUTES}/search`
export const GET_DM_CONTACTS_ROUTES = `${CONTACTS_ROUTES}/get-contacts-for-dm`
export const GET_ALL_CONTACTS_ROUTES = `${CONTACTS_ROUTES}/get-all-contacts`


//////////////////////////////  CONTACT  ////////////////////////////////
export const MESSAGES_ROUTES = `/api/messages`
export const GET_ALL_MESSAGES_ROUTES = `${MESSAGES_ROUTES}/get-messages`
export const UPLOAD_FILES_ROUTES = `${MESSAGES_ROUTES}/upload-file`

