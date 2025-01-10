# JSDoc Templates

## Function Documentation
```typescript
/**
 * Brief description of what the function does.
 *
 * @description
 * Detailed description of the function's purpose and behavior.
 * Include any important notes about usage.
 *
 * @example
 * ```typescript
 * const result = myFunction('input')
 * console.log(result) // Expected output
 * ```
 *
 * @param paramName - Description of the parameter
 * @param options - Configuration options object
 * @param options.prop - Description of an option property
 *
 * @returns Description of the return value
 *
 * @throws {ErrorType} Description of when this error occurs
 *
 * @see RelatedFunction
 * @see AnotherComponent
 */
```

## Component Documentation
```typescript
/**
 * Brief description of the component's purpose.
 *
 * @description
 * Detailed explanation of the component's functionality.
 * Include any important context or usage notes.
 *
 * @example
 * ```tsx
 * <MyComponent
 *   prop="value"
 *   onEvent={() => {}}
 * />
 * ```
 *
 * @prop {string} propName - Description of the prop
 * @prop {(value: string) => void} onEvent - Event handler description
 *
 * @see RelatedComponent
 * @see ContextProvider
 */
```

## Type Documentation
```typescript
/**
 * Brief description of what this type represents.
 *
 * @description
 * Detailed explanation of the type's purpose and usage.
 * Include any validation requirements or constraints.
 *
 * @example
 * ```typescript
 * const data: MyType = {
 *   prop: 'value'
 * }
 * ```
 *
 * @property propName - Description of the property
 * @property {string} [optional] - Optional property description
 *
 * @see RelatedType
 * @see ValidationSchema
 */
```

## Hook Documentation
```typescript
/**
 * Brief description of the hook's purpose.
 *
 * @description
 * Detailed explanation of what the hook does and when to use it.
 * Include any dependencies or context requirements.
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useMyHook('param')
 *
 * if (isLoading) {
 *   return <Loading />
 * }
 * ```
 *
 * @param paramName - Description of the parameter
 * @returns Description of the return value and its properties
 *
 * @throws {ErrorType} Description of potential errors
 *
 * @see RelatedHook
 * @see RequiredProvider
 */
```

## Constants Documentation
```typescript
/**
 * Brief description of what these constants represent.
 *
 * @description
 * Detailed explanation of the constants and their purpose.
 * Include any important usage notes or constraints.
 *
 * @example
 * ```typescript
 * if (status === STATUS.ACTIVE) {
 *   // Handle active state
 * }
 * ```
 *
 * @constant STATUS - Description of the constant group
 * @constant STATUS.ACTIVE - Description of this specific value
 *
 * @see RelatedConstants
 * @see TypeDefinition
 */
```

## Schema Documentation
```typescript
/**
 * Brief description of what this schema validates.
 *
 * @description
 * Detailed explanation of the validation rules and their purpose.
 * Include any important validation constraints.
 *
 * @example
 * ```typescript
 * const result = mySchema.parse(data)
 * ```
 *
 * @property fieldName - Description and validation rules
 * @property {string} required - Required field description
 * @property {number} [optional] - Optional field description
 *
 * @throws {ZodError} Description of validation failures
 *
 * @see RelatedSchema
 * @see TypeDefinition
 */
```

## Best Practices

1. **Consistency**
   - Use consistent terminology
   - Follow the same format for similar items
   - Keep descriptions clear and concise

2. **Examples**
   - Include practical usage examples
   - Show common use cases
   - Demonstrate error handling

3. **Cross-References**
   - Link to related code
   - Reference dependencies
   - Point to relevant documentation

4. **Updates**
   - Keep documentation in sync with code
   - Update examples when APIs change
   - Review and refresh periodically
