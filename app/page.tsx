'use client'

import { ReactElement, useContext, useEffect, useState } from 'react'
import { AppDateContext } from '../components/contexts/appDate'
import { AppDate, AppTimeSpan } from '../domains/appDate'

export default function Page(): ReactElement {
  const { dateService, options, setOptions } = useContext(AppDateContext)
  const [startTime, setStartTime] = useState<AppDate>()
  const [now, setNow] = useState(dateService.now())
  const [timeSpan, setTimeSpan] = useState<AppTimeSpan>()
  const coefficient =
    options?.__typename === 'BoostedAppDate' ? options.params[2] : 1
  useEffect(() => {
    if (!startTime) {
      setStartTime(dateService.now())
    }
  }, [dateService, startTime])
  useEffect(() => {
    if (!startTime) {
      return
    }
    setTimeout(() => {
      const _now = dateService.now()
      setNow(_now)
      setTimeSpan(_now.timeSpan(startTime))
    }, 1)
  }, [startTime, now, dateService])

  return (
    <div style={{ fontSize: '18pt' }}>
      <p>{coefficient === 1 ? 'system date' : `Boosted x${coefficient}`}</p>
      <p>Start: {startTime?.displayString()}</p>
      <p>App Date Now: {startTime && now.displayString()}</p>
      <p>Time Span: {timeSpan && timeSpan.displayString()}</p>
      <p>Current Age: {startTime && dateService.currentAge(startTime)}</p>
      <p>
        Boost:{' '}
        <input
          type="number"
          style={{
            height: '18pt',
          }}
          min="1"
          step="1"
          value={coefficient}
          onInput={({ target }) => {
            if (!startTime) {
              return
            }
            setOptions({
              __typename: 'BoostedAppDate',
              params: [
                startTime.displayString(),
                0,
                Number((target as HTMLInputElement).value),
              ],
            })
          }}
        />
      </p>
      <div>
        <svg width={256} height={256}>
          <circle fill="#eee" cx={128} cy={128} r="128" />
          <line
            stroke="#222"
            transform={`rotate(${now.seconds() * 6}, 128, 128)`}
            strokeWidth={3}
            x1="128"
            y1="128"
            x2="128"
            y2="4"
          />
          <line
            stroke="#22e"
            strokeWidth={5}
            transform={`rotate(${now.minute() * 6}, 128, 128)`}
            x1="128"
            y1="128"
            x2="128"
            y2="16"
          />
          <line
            stroke="#e22"
            strokeWidth={5}
            transform={`rotate(${(now.hour() / 2) * (360 / 12)}, 128, 128)`}
            x1="128"
            y1="128"
            x2="128"
            y2="24"
          />
        </svg>
      </div>
    </div>
  )
}
