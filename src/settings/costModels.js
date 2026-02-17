/*
 * Copyright 2026 Jeffrey Guntly (JX Holdings, LLC)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Cost Calculation Configuration Module
 * 
 * Provides configurable cost precedence models for determining effective cost:
 * - Paid-first: Prioritizes paid amounts over estimated
 * - Quoted-first: Prioritizes quoted amounts over estimated
 * - Custom precedence: User-defined precedence order
 */

// Available cost calculation models
export const COST_MODELS = {
  ACTUAL_FIRST: 'actual-first',        // actual > paid > partial > quoted > estimated (default)
  PAID_FIRST: 'paid-first',            // paid > actual > partial > quoted > estimated
  QUOTED_FIRST: 'quoted-first',        // quoted > actual > paid > partial > estimated
  ESTIMATED_FIRST: 'estimated-first',  // estimated > quoted > paid > actual > partial
  CUSTOM: 'custom'                     // user-defined precedence order
};

// Default cost model
export const DEFAULT_COST_MODEL = COST_MODELS.ACTUAL_FIRST;

// Default precedence order for ACTUAL_FIRST model
export const DEFAULT_PRECEDENCE_ORDER = ['actual', 'paid', 'partially_paid', 'quoted', 'estimated'];

// Precedence orders for built-in models
export const PRECEDENCE_ORDERS = {
  [COST_MODELS.ACTUAL_FIRST]: ['actual', 'paid', 'partially_paid', 'quoted', 'estimated'],
  [COST_MODELS.PAID_FIRST]: ['paid', 'actual', 'partially_paid', 'quoted', 'estimated'],
  [COST_MODELS.QUOTED_FIRST]: ['quoted', 'actual', 'paid', 'partially_paid', 'estimated'],
  [COST_MODELS.ESTIMATED_FIRST]: ['estimated', 'quoted', 'paid', 'actual', 'partially_paid']
};

/**
 * Normalize cost value from various field formats
 * @param  {...any} values - Cost values to normalize
 * @returns {number} Normalized cost value
 */
const normalizeCost = (...values) => {
  for (const value of values) {
    if (value === null || value === undefined || value === '') continue;
    const numericValue = typeof value === 'number' ? value : Number(value);
    if (Number.isFinite(numericValue)) return numericValue;
  }
  return 0;
};

/**
 * Extract all cost values from an entity
 * @param {Object} entity - Entity with cost fields
 * @returns {Object} Normalized cost values by type
 */
const extractCosts = (entity = {}) => {
  return {
    actual: normalizeCost(entity.actualCost, entity.actual_cost),
    paid: normalizeCost(entity.amount_paid, entity.paidCost, entity.amountPaid),
    partially_paid: normalizeCost(entity.partially_paid, entity.partiallyPaidAmount, entity.partialPaidCost),
    quoted: normalizeCost(entity.quoted_cost, entity.quotedCost),
    estimated: normalizeCost(entity.estimated_cost, entity.estimatedCost)
  };
};

/**
 * Resolve cost precedence based on configuration
 * @param {Object} entity - Entity with cost fields
 * @param {string} model - Cost calculation model
 * @param {Array<string>} customOrder - Custom precedence order (for CUSTOM model)
 * @returns {Object} { value: number, source: string }
 */
export const resolveCostPrecedenceWithModel = (entity = {}, model = DEFAULT_COST_MODEL, customOrder = null) => {
  const costs = extractCosts(entity);
  
  // Determine precedence order
  let order;
  if (model === COST_MODELS.CUSTOM && customOrder && Array.isArray(customOrder)) {
    order = customOrder;
  } else {
    order = PRECEDENCE_ORDERS[model] || DEFAULT_PRECEDENCE_ORDER;
  }
  
  // Find first non-zero cost following precedence order
  for (const source of order) {
    if (costs[source] > 0) {
      return { value: costs[source], source };
    }
  }
  
  // If all costs are zero, return estimated (last fallback)
  return { value: costs.estimated, source: 'estimated' };
};

/**
 * Get effective cost value based on configuration
 * @param {Object} entity - Entity with cost fields
 * @param {string} model - Cost calculation model
 * @param {Array<string>} customOrder - Custom precedence order
 * @returns {number} Effective cost value
 */
export const getEffectiveCostWithModel = (entity = {}, model = DEFAULT_COST_MODEL, customOrder = null) => {
  return resolveCostPrecedenceWithModel(entity, model, customOrder).value;
};

/**
 * Validate cost model
 * @param {string} model - Cost model to validate
 * @returns {boolean} True if valid
 */
export const isValidCostModel = (model) => {
  return Object.values(COST_MODELS).includes(model);
};

/**
 * Validate custom precedence order
 * @param {Array<string>} order - Custom order to validate
 * @returns {boolean} True if valid
 */
export const isValidPrecedenceOrder = (order) => {
  if (!Array.isArray(order) || order.length === 0) return false;
  
  const validSources = ['actual', 'paid', 'partially_paid', 'quoted', 'estimated'];
  return order.every(source => validSources.includes(source));
};

/**
 * Get cost model configuration
 * @param {Object} settings - User settings
 * @returns {Object} { model: string, customOrder: Array<string> | null }
 */
export const getCostModelConfig = (settings = {}) => {
  const model = settings.costModel || DEFAULT_COST_MODEL;
  const customOrder = settings.costPrecedenceOrder || null;
  
  return {
    model: isValidCostModel(model) ? model : DEFAULT_COST_MODEL,
    customOrder: isValidPrecedenceOrder(customOrder) ? customOrder : null
  };
};

/**
 * Get human-readable label for cost model
 * @param {string} model - Cost model
 * @returns {string} Human-readable label
 */
export const getCostModelLabel = (model) => {
  const labels = {
    [COST_MODELS.ACTUAL_FIRST]: 'Actual First (Default)',
    [COST_MODELS.PAID_FIRST]: 'Paid First',
    [COST_MODELS.QUOTED_FIRST]: 'Quoted First',
    [COST_MODELS.ESTIMATED_FIRST]: 'Estimated First',
    [COST_MODELS.CUSTOM]: 'Custom Order'
  };
  return labels[model] || 'Unknown';
};

/**
 * Get description for cost model
 * @param {string} model - Cost model
 * @returns {string} Description
 */
export const getCostModelDescription = (model) => {
  const descriptions = {
    [COST_MODELS.ACTUAL_FIRST]: 'Prioritizes actual costs, then paid, partial, quoted, and estimated amounts',
    [COST_MODELS.PAID_FIRST]: 'Prioritizes paid amounts first, useful for tracking actual expenses',
    [COST_MODELS.QUOTED_FIRST]: 'Prioritizes quoted amounts, useful for budget planning',
    [COST_MODELS.ESTIMATED_FIRST]: 'Prioritizes estimated costs, useful for early-stage planning',
    [COST_MODELS.CUSTOM]: 'Uses custom precedence order defined by user'
  };
  return descriptions[model] || '';
};
