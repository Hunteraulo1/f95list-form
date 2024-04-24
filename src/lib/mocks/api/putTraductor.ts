import { getTraductors } from "./getTraductors"

import { Traductor, type TraductorType } from "$types/schemas"

interface PutTraductorArgs {
  query: { name: TraductorType["name"] }
  data: TraductorType
}

export const putTraductor = async ({ query, data }: PutTraductorArgs): Promise<void | string> => {
  // Report request
  console.info("putTraductor called")

  const validData = Traductor.parse(data)

  try {
    const traductors = await getTraductors()

    const traductorIndex = traductors.findIndex((traductor) => {
      traductor.name === query.name
    })

    if (traductorIndex === -1) throw new Error("traductor not found")

    const duplicate = traductors?.findIndex((game) => game.name === validData.name)

    if (duplicate !== -1) {
      return "duplicate"
    }
  } catch (error) {
    console.error(error)

    throw new Error("putTraductor error")
  }
}
