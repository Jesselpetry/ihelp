/**
 * Shared by app/api/chat and the widget. Kept apart from the route so the
 * client bundle never imports server code to read one string.
 *
 * A streamed (model) reply carries its "open file" buttons in this header as
 * URI-encoded JSON; a catalog reply sends them in the JSON body instead.
 */
export const FILES_HEADER = "X-Chat-Files";
