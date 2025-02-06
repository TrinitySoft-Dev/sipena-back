export interface ITimesheetWorker {
  worker: number
  break: Date
  waiting_time: Date
  time: Date
  time_out: Date
  extra_rules: string
  pay: number
}
