import { SelectedFieldsRegistry } from '../decorators/selected-fields.decorator'

export default function getSelectedFieldsPaths(
  entityClass: Function,
  prefixPaths: string[] = [],
  processedEntities: Set<Function> = new Set(),
): string[] {
  const allSelectedFields = SelectedFieldsRegistry.getSelectedFields()
  const fieldsForEntity = allSelectedFields.filter(f => f.target === entityClass)

  const results: string[] = []

  processedEntities.add(entityClass)

  fieldsForEntity.forEach(({ propertyName, relation }) => {
    const currentPropertyPath = [...prefixPaths, propertyName]

    if (relation) {
      if (!processedEntities.has(relation)) {
        const relatedResults = getSelectedFieldsPaths(relation, currentPropertyPath, new Set(processedEntities))
        results.push(...relatedResults)
      }
    } else {
      const path = currentPropertyPath.join('.')
      results.push(path)
    }
  })

  return results
}
