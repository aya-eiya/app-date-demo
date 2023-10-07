export interface AppDate {
  isAfterOrEqual(other: AppDate): boolean | undefined
  displayString(): string
  timeSpan(from: AppDate): AppTimeSpan | undefined
  year(): number // yyyy: ex) 2001
  month(): number // mon: 1-12
  date(): number // dd: 1-31
  hour(): number // hh: 0-23
  minute(): number // min: 0-59
  seconds(): number // sec: 0-59
  millSecond(): number // milliSecond: 0-999
}

export interface AppTimeSpan {
  displayString(): string
  asMS(): number
}

export interface AppDateService {
  now(): AppDate
  of(dateString: string): AppDate
  currentAge(of: AppDate): number
}
