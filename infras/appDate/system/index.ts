import { AppDate, AppTimeSpan, AppDateService } from '../../../domains/appDate'

export class UtcAppDate implements AppDate {
  __typename = 'UtcApplicationDate'

  constructor(readonly _inner: Date) {}
  year(): number {
    return this._inner.getUTCFullYear()
  }
  month(): number {
    return this._inner.getUTCMonth()
  }
  date(): number {
    return this._inner.getUTCDate()
  }
  hour(): number {
    return this._inner.getUTCHours()
  }
  minute(): number {
    return this._inner.getUTCMinutes()
  }
  seconds(): number {
    return this._inner.getUTCSeconds()
  }
  millSecond(): number {
    return this._inner.getUTCMilliseconds()
  }

  isSameClass(date: AppDate): date is UtcAppDate {
    if (date instanceof UtcAppDate) {
      return true
    }
    if ((date as typeof this).__typename !== 'UtcApplicationDate') {
      return true
    }
    return false
  }

  isAfterOrEqual(other: AppDate): boolean | undefined {
    const s = this.timeSpan(other)
    if (!s) {
      return undefined
    }
    return s.asMS() >= 0
  }

  displayString(): string {
    return this._inner.toUTCString()
  }

  timeSpan(from: AppDate): AppTimeSpan | undefined {
    if (!this.isSameClass(from)) {
      return undefined
    }
    return new UtcAppTimeSpan(from, this)
  }
}

export class UtcAppDateService implements AppDateService {
  now(): AppDate {
    return new UtcAppDate(new Date())
  }
  of(dateString: string): AppDate {
    return new UtcAppDate(new Date(dateString))
  }
  currentAge(of: AppDate): number {
    const nowUTC = this.now()
    const ofUTC = new UtcAppDate(
      new Date(of.year(), of.month() - 1, of.date() - 1)
    )
    const age =
      nowUTC.year() - ofUTC.year() + (nowUTC.isAfterOrEqual(ofUTC) ? 0 : -1)
    return age
  }
}

export class UtcAppTimeSpan implements AppTimeSpan {
  private ms: number = 0
  constructor(from: UtcAppDate, to: UtcAppDate) {
    this.ms = (to._inner as Date).getTime() - (from._inner as Date).getTime()
  }
  displayString(): string {
    const d = 24 * 60 * 60 * 1000
    const h = 60 * 60 * 1000
    const m = 60 * 1000
    const s = 1000
    const days = Math.floor(this.ms / d)
    let a = this.ms % d
    const hours = Math.floor(a / h)
    a = a % h
    const minutes = Math.floor(a / m)
    a = a % m
    const seconds = Math.floor(a / s)
    const millSeconds = a % s
    let display = days ? `${days} 日` : ``
    display =
      display + (hours ? `${hours} 時間` : display.length > 0 ? `0 時間` : ``)
    display =
      display + (minutes ? `${minutes} 分` : display.length > 0 ? `0 分` : ``)
    display = display + (seconds ? `${seconds}` : `0`)
    display = display + (millSeconds ? `.${millSeconds} 秒` : `.000 秒`)
    return display
  }
  asMS(): number {
    return this.ms
  }
}
