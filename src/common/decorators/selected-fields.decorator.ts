class SelectedFieldsRegistry {
  private static selectedFields: {
    target: Function
    propertyName: string
    relation?: () => Function
  }[] = []

  static register(target: Function, propertyName: string, relation?: () => Function) {
    SelectedFieldsRegistry.selectedFields.push({ target, propertyName, relation })
  }

  static getSelectedFields() {
    return SelectedFieldsRegistry.selectedFields.map(field => ({
      ...field,
      relation: field.relation ? field.relation() : undefined,
    }))
  }
}

function SelectedField(options?: { relation?: () => Function }) {
  return function (target: any, propertyName: string) {
    SelectedFieldsRegistry.register(target.constructor, propertyName, options?.relation)
  }
}
export { SelectedField, SelectedFieldsRegistry }
