import { AppDate, AppDateService } from '../../../domains/appDate'
import { UtcAppDate, UtcAppTimeSpan } from '../system'

export class BoostedAppDate extends UtcAppDate {
  __typename = 'BoostedAppDate'
}

export class BoostedAppDateService implements AppDateService {
  constructor(
    readonly baseDate: string,
    readonly offsetDays: number,
    readonly coefficient: number
  ) {}
  now(): AppDate {
    const base = new Date(this.baseDate).getTime()
    const current = new Date().getTime() + this.offsetDays * 24 * 60 * 60 * 1000
    const now = base + (current - base) * this.coefficient
    return new BoostedAppDate(new Date(now))
  }
  of(dateString: string): AppDate {
    const base = new Date(this.baseDate).getTime()
    const current =
      new Date(dateString).getTime() + this.offsetDays * 24 * 60 * 60 * 1000
    const now = base + (current - base) * this.coefficient
    return new BoostedAppDate(new Date(now))
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

export class BoostedAppTimeSpan extends UtcAppTimeSpan {}
