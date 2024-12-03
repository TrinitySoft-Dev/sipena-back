import { SelectedFieldsRegistry } from '../decorators/selected-fields.decorator'

export default function getSelectedFieldsWithPaths(
  entityClass: Function,
  prefixLabels: string[] = [],
  prefixPaths: string[] = [],
  processedEntities: Set<Function> = new Set(),
): Array<{ label: string; path: string }> {
  const allSelectedFields = SelectedFieldsRegistry.getSelectedFields()
  const fieldsForEntity = allSelectedFields.filter(f => f.target === entityClass)

  const results: Array<{ label: string; path: string }> = []

  processedEntities.add(entityClass)

  fieldsForEntity.forEach(({ propertyName, relation }) => {
    const currentLabelPath = [...prefixLabels, propertyName]
    const currentPropertyPath = [...prefixPaths, propertyName]

    if (relation) {
      if (!processedEntities.has(relation)) {
        const relatedResults = getSelectedFieldsWithPaths(
          relation,
          currentLabelPath,
          currentPropertyPath,
          new Set(processedEntities),
        )
        results.push(...relatedResults)
      }
    } else {
      const label = currentLabelPath.join(' - ')
      const path = currentPropertyPath.join('.')
      results.push({ label, path })
    }
  })

  return results
}
