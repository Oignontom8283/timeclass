
/**
 * Parses a CSS transform string and extracts transform functions with their numeric arguments.
 * 
 * @param transform - The CSS transform string to parse (e.g., "translate(394px, 884px) rotate(16135.3deg)")
 * @returns A record where keys are function names and values are arrays of numeric arguments (units removed)
 * 
 * @example
 * ```typescript
 * parseReactMoveTransform("translate(394px, 884px) rotate(16135.3deg) scale(10.8593, 8.4758)")
 * // Returns: {translate: [394, 884], rotate: [16135.3], scale: [10.8593, 8.4758]}
 * 
 * parseReactMoveTransform("translateX(50px) skew(45deg, 30deg)")
 * // Returns: {translateX: [50], skew: [45, 30]}
 * 
 * parseReactMoveTransform("scale(invalid, 2)")
 * // Returns: {scale: [-1, 2]} // Invalid values become -1
 * ```
 */
export function parseReactMoveTransform(transform: string): Record<string, number[]> {
  const result: Record<string, number[]> = {};
  
  // Regex pour capturer les fonctions et leurs arguments
  const functionRegex = /(\w+)\(([^)]+)\)/g;
  
  let match;
  while ((match = functionRegex.exec(transform)) !== null) {
    const functionName = match[1];
    const argsString = match[2];
    
    // Extraire les arguments numériques
    const args = argsString
      .split(',')
      .map(arg => {
        // Nettoyer l'argument (supprimer les espaces et unités)
        const cleanArg = arg.trim().replace(/[a-zA-Z%]+/g, '');
        const num = parseFloat(cleanArg);
        
        // Retourner -1 si la conversion échoue
        return isNaN(num) ? -1 : num;
      });
    
    result[functionName] = args;
  }
  
  return result;
}

/**
 * Retrieves the numeric arguments of a specific transform function from a CSS transform string.
 * 
 * @param transform - The CSS transform string to search in
 * @param element - The name of the transform function to extract (e.g., "translate", "rotate", "scale")
 * @returns Array of numeric arguments for the specified function, or null if the function is not found
 * 
 * @example
 * ```typescript
 * const transform = "translate(394px, 884px) rotate(16135.3deg) scale(10.8593, 8.4758)";
 * 
 * getReactTransform(transform, "translate")
 * // Returns: [394, 884]
 * 
 * getReactTransform(transform, "rotate")
 * // Returns: [16135.3]
 * 
 * getReactTransform(transform, "skew")
 * // Returns: null (function not found)
 * ```
 */
export function getReactTransform(transform: string, element: string): number[] | null {
  // Utiliser la fonction parseReactMoveTransform pour parser le transform
  const parsed = parseReactMoveTransform(transform);
  
  // Retourner les arguments de l'élément demandé ou null s'il n'existe pas
  return parsed[element] || null;
}

/**
 * Modifies specific arguments of a transform function in a CSS transform string while preserving units.
 * 
 * @param transform - The CSS transform string to modify
 * @param element - The name of the transform function to modify (e.g., "translate", "rotate", "scale")
 * @param values - Array of new values. Use null to keep existing values unchanged. Extra values are ignored.
 * @returns The modified transform string with updated values
 * @throws Error if the specified transform function is not found in the string
 * 
 * @example
 * ```typescript
 * const transform = "translate(394px, 884px) rotate(16135.3deg) scale(10.8593, 8.4758)";
 * 
 * // Modify only the first argument of translate, keep the second unchanged
 * setReactTransform(transform, "translate", [500, null])
 * // Returns: "translate(500px, 884px) rotate(16135.3deg) scale(10.8593, 8.4758)"
 * 
 * // Modify both arguments of scale
 * setReactTransform(transform, "scale", [15.5, 12.3])
 * // Returns: "translate(394px, 884px) rotate(16135.3deg) scale(15.5, 12.3)"
 * 
 * // Modify rotation value
 * setReactTransform(transform, "rotate", [45])
 * // Returns: "translate(394px, 884px) rotate(45deg) scale(10.8593, 8.4758)"
 * 
 * // Error when function not found
 * setReactTransform(transform, "skew", [45])
 * // Throws: Error: Element 'skew' not found in transform string
 * 
 * // Insufficient arguments - remaining values stay unchanged
 * setReactTransform(transform, "translate", [100])
 * // Returns: "translate(100px, 884px) rotate(16135.3deg) scale(10.8593, 8.4758)"
 * ```
 */
export function setReactTransform(transform: string, element: string, values: (number | null)[]): string {
  // Regex pour capturer une fonction spécifique et ses arguments
  const functionRegex = new RegExp(`(${element})\\(([^)]+)\\)`, 'g');
  
  let match = functionRegex.exec(transform);
  if (!match) {
    throw new Error(`Element '${element}' not found in transform string`);
  }
  
  const functionName = match[1];
  const argsString = match[2];
  const fullMatch = match[0];
  
  // Parser les arguments existants pour conserver les unités
  const existingArgs = argsString.split(',').map(arg => arg.trim());
  
  // Créer les nouveaux arguments
  const newArgs = existingArgs.map((arg, index) => {
    if (index >= values.length || values[index] === null) {
      // Garder l'argument existant si pas de valeur fournie ou valeur null
      return arg;
    }
    
    // Extraire l'unité de l'argument existant
    const unitMatch = arg.match(/[a-zA-Z%]+$/);
    const unit = unitMatch ? unitMatch[0] : '';
    
    // Remplacer la valeur en conservant l'unité
    return values[index] + unit;
  });
  
  // Reconstruire la fonction avec les nouveaux arguments
  const newFunction = `${functionName}(${newArgs.join(', ')})`;
  
  // Remplacer dans la chaîne originale
  return transform.replace(fullMatch, newFunction);
}