import { parseAsBoolean, parseAsString } from 'nuqs'

export const chatSearchParams = {
  chat_open: parseAsBoolean.withDefault(false),
  chat_initial_message: parseAsString,
}
