import { ValidationError } from "class-validator"
import { Logger } from "../shared/utils/logger"

export class Warning extends Error {

  public readonly message: string | undefined
  public readonly code: number
  public readonly logger: Logger

  constructor(message: unknown, code = 500, logger: Logger = {}) {
    super()

    this.code = code
    this.logger = logger

    if (typeof message === "string") {
      this.message = message
    }

    if (Array.isArray(message) && typeof message[0] === "string") {
      this.message = message[0]
    }

    if (Array.isArray(message) && message[0] instanceof ValidationError) {

      const errors: string[] = message.map(value => {

        const key = Object.keys(value.constraints).pop() as string
        return value.constraints[key]
      })

      this.message += errors.map((err) => { return err + '\n' })
    }
  }
}
