'use client'

import { BoostedAppDateService } from '../../infras/appDate/boosted'
import { UtcAppDateService } from '../../infras/appDate/system'
import { ReactElement, createContext, useEffect, useState } from 'react'
import { AppDateService } from '../../domains/appDate'

const system = new UtcAppDateService()

const baseDate = system.now().displayString()
const dateOffset = 0
const coefficient: number = 1

type Options =
  | {
      __typename: 'UtcAppDate'
      params: ConstructorParameters<typeof UtcAppDateService>
    }
  | {
      __typename: 'BoostedAppDate'
      params: ConstructorParameters<typeof BoostedAppDateService>
    }

export const AppDateContext = createContext<{
  dateService: AppDateService
  options: Options
  setOptions: (options: Options) => void
}>({
  dateService: system,
  options: { __typename: 'UtcAppDate', params: [] },
  setOptions: () => {},
})

export function AppDateProvider({
  children,
}: {
  children: ReactElement
}): ReactElement {
  const [options, setOptions] = useState<Options>({
    __typename: 'BoostedAppDate',
    params: [baseDate, dateOffset, coefficient],
  })
  const [dateService, setDateService] = useState<AppDateService>(system)
  useEffect(() => {
    const dateService =
      options?.__typename === 'BoostedAppDate' && options.params[2] > 1
        ? new BoostedAppDateService(
            options.params[0],
            options.params[1],
            options.params[2]
          )
        : system
    setDateService(dateService)
  }, [options])
  return (
    <AppDateContext.Provider
      value={{
        dateService,
        options,
        setOptions,
      }}
    >
      {children}
    </AppDateContext.Provider>
  )
}
