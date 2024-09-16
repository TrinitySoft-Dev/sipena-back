import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsBoolean, IsDateString, IsNumber, IsObject, IsString } from 'class-validator'

export class TimeSheetDto {
  @ApiProperty({
    description: 'Customer id of the timesheet',
    example: 1,
  })
  @IsNumber()
  customer_id: number

  @ApiProperty({
    description: 'Day of the timesheet',
    example: '2021-01-01',
  })
  @IsDateString()
  day: Date

  @ApiProperty({
    description: 'Week of the timesheet',
    example: '2021-01-01',
  })
  @IsDateString()
  week: Date

  @ApiProperty({
    description: 'Comment of the timesheet',
    example: 'Comment',
  })
  @IsString()
  comment: string

  @ApiProperty({
    description: 'Images of the timesheet',
    example: ['https://sipena.com/images/1'],
  })
  @IsArray()
  images: string[]

  @ApiProperty({
    description: 'Workers of the timesheet',
    example: [1],
  })
  @IsArray()
  workers: number[]
}

export class ContainerDto {
  @ApiProperty({
    description: 'Container number of the timesheet',
    example: '1',
  })
  @IsString()
  container_number: string

  @ApiProperty({
    description: 'Work of the timesheet',
    example: '10',
  })
  @IsString()
  work: string

  @ApiProperty({
    description: 'Size of the timesheet',
    example: 10,
  })
  @IsNumber()
  size: number

  @ApiProperty({
    description: 'Id of the product',
    example: '1',
  })
  @IsString()
  product: string

  @ApiProperty({
    description: 'Skus of the timesheet',
    example: '1',
  })
  @IsString()
  skus: string

  @ApiProperty({
    description: 'Cartons of the timesheet',
    example: 1,
  })
  @IsNumber()
  cartons: number

  @ApiProperty({
    description: 'Pallets of the timesheet',
    example: 1,
  })
  @IsNumber()
  pallets: number

  @ApiProperty({
    description: 'Weight of the timesheet',
    example: 10,
  })
  @IsNumber()
  weight: number

  @ApiProperty({
    description: 'forklift of the timesheet',
    example: true,
  })
  @IsBoolean()
  forklift_driver: boolean

  @ApiProperty({
    description: 'Trash of the timesheet',
    example: true,
  })
  @IsBoolean()
  trash: boolean

  @ApiProperty({
    description: 'Mixed of the timesheet',
    example: true,
  })
  @IsBoolean()
  mixed: boolean

  @ApiProperty({
    description: 'Start of the timesheet',
    example: '2021-01-01',
  })
  @IsDateString()
  start: Date

  @ApiProperty({
    description: 'End of the timesheet',
    example: '2021-01-01',
  })
  @IsDateString()
  finish: Date

  @ApiProperty({
    description: 'Total time of the timesheet',
    example: '30:00',
  })
  @IsString()
  total_time: string

  @ApiProperty({
    description: 'plt_time_min of the timesheet',
    example: '30:00',
  })
  @IsString()
  plt_time_min: string
}

export class CreateTimesheetDto {
  @ApiProperty({
    description: 'Timesheet of the timesheet',
    example: {
      customer_id: 1,
      day: '2021-01-01',
      week: '2021-01-01',
      comment: 'Comment',
      images: ['https://sipena.com/images/1'],
      workers: [1],
    },
  })
  @IsObject()
  timesheet: TimeSheetDto

  @ApiProperty({
    description: 'Container of the timesheet',
    example: {
      container_number: '1',
      work: '10',
      size: 10,
      product: '1',
      skus: '1',
      cartons: 1,
      pallets: 1,
      weight: 10,
      forklift_driver: true,
      trash: true,
      mixed: true,
      start: '2021-01-01',
      finish: '2021-01-01',
      total_time: '30:00',
      plt_time_min: '30:00',
    },
  })
  @IsObject()
  container: ContainerDto
}
