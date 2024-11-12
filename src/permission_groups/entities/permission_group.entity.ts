import { Entity } from 'typeorm'

@Entity({
  name: 'permission_groups',
})
export class PermissionGroup {
  id: string
}
