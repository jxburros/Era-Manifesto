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

import { test } from 'node:test';
import assert from 'node:assert';
import {
  COST_MODELS,
  DEFAULT_COST_MODEL,
  resolveCostPrecedenceWithModel,
  getEffectiveCostWithModel,
  getCostModelConfig,
  getCostModelLabel,
  isValidCostModel,
  isValidPrecedenceOrder
} from '../src/settings/costModels.js';

test('COST_MODELS contains expected models', () => {
  assert.strictEqual(COST_MODELS.ACTUAL_FIRST, 'actual-first');
  assert.strictEqual(COST_MODELS.PAID_FIRST, 'paid-first');
  assert.strictEqual(COST_MODELS.QUOTED_FIRST, 'quoted-first');
  assert.strictEqual(COST_MODELS.ESTIMATED_FIRST, 'estimated-first');
  assert.strictEqual(COST_MODELS.CUSTOM, 'custom');
});

test('DEFAULT_COST_MODEL is actual-first', () => {
  assert.strictEqual(DEFAULT_COST_MODEL, COST_MODELS.ACTUAL_FIRST);
});

test('resolveCostPrecedenceWithModel uses actual-first by default', () => {
  const entity = {
    actualCost: 100,
    paidCost: 80,
    quotedCost: 90,
    estimatedCost: 70
  };
  const result = resolveCostPrecedenceWithModel(entity);
  assert.strictEqual(result.value, 100);
  assert.strictEqual(result.source, 'actual');
});

test('resolveCostPrecedenceWithModel respects paid-first model', () => {
  const entity = {
    actualCost: 100,
    paidCost: 80,
    quotedCost: 90,
    estimatedCost: 70
  };
  const result = resolveCostPrecedenceWithModel(entity, COST_MODELS.PAID_FIRST);
  assert.strictEqual(result.value, 80);
  assert.strictEqual(result.source, 'paid');
});

test('resolveCostPrecedenceWithModel respects quoted-first model', () => {
  const entity = {
    actualCost: 100,
    paidCost: 80,
    quotedCost: 90,
    estimatedCost: 70
  };
  const result = resolveCostPrecedenceWithModel(entity, COST_MODELS.QUOTED_FIRST);
  assert.strictEqual(result.value, 90);
  assert.strictEqual(result.source, 'quoted');
});

test('resolveCostPrecedenceWithModel respects estimated-first model', () => {
  const entity = {
    actualCost: 100,
    paidCost: 80,
    quotedCost: 90,
    estimatedCost: 70
  };
  const result = resolveCostPrecedenceWithModel(entity, COST_MODELS.ESTIMATED_FIRST);
  assert.strictEqual(result.value, 70);
  assert.strictEqual(result.source, 'estimated');
});

test('resolveCostPrecedenceWithModel supports custom order', () => {
  const entity = {
    actualCost: 100,
    paidCost: 80,
    quotedCost: 90,
    estimatedCost: 70
  };
  const customOrder = ['estimated', 'quoted', 'paid', 'actual', 'partially_paid'];
  const result = resolveCostPrecedenceWithModel(entity, COST_MODELS.CUSTOM, customOrder);
  assert.strictEqual(result.value, 70);
  assert.strictEqual(result.source, 'estimated');
});

test('resolveCostPrecedenceWithModel skips zero values in custom order', () => {
  const entity = {
    actualCost: 100,
    paidCost: 0,
    quotedCost: 90,
    estimatedCost: 0
  };
  const customOrder = ['estimated', 'quoted', 'paid', 'actual'];
  const result = resolveCostPrecedenceWithModel(entity, COST_MODELS.CUSTOM, customOrder);
  // Estimated is 0, so it should fall back to quoted (90)
  assert.strictEqual(result.value, 90);
  assert.strictEqual(result.source, 'quoted');
});

test('getEffectiveCostWithModel returns numeric value', () => {
  const entity = { actualCost: 100, estimatedCost: 70 };
  const cost = getEffectiveCostWithModel(entity);
  assert.strictEqual(cost, 100);
});

test('getEffectiveCostWithModel returns 0 for empty entity', () => {
  const cost = getEffectiveCostWithModel({});
  assert.strictEqual(cost, 0);
});

test('isValidCostModel validates model strings', () => {
  assert.strictEqual(isValidCostModel(COST_MODELS.ACTUAL_FIRST), true);
  assert.strictEqual(isValidCostModel(COST_MODELS.PAID_FIRST), true);
  assert.strictEqual(isValidCostModel('invalid-model'), false);
  assert.strictEqual(isValidCostModel(null), false);
});

test('isValidPrecedenceOrder validates custom orders', () => {
  assert.strictEqual(isValidPrecedenceOrder(['actual', 'paid', 'quoted']), true);
  assert.strictEqual(isValidPrecedenceOrder(['estimated', 'quoted']), true);
  assert.strictEqual(isValidPrecedenceOrder([]), false);
  assert.strictEqual(isValidPrecedenceOrder(['invalid_source']), false);
  assert.strictEqual(isValidPrecedenceOrder(null), false);
});

test('getCostModelConfig returns default model when no settings', () => {
  const config = getCostModelConfig({});
  assert.strictEqual(config.model, DEFAULT_COST_MODEL);
  assert.strictEqual(config.customOrder, null);
});

test('getCostModelConfig returns configured model', () => {
  const settings = { costModel: COST_MODELS.PAID_FIRST };
  const config = getCostModelConfig(settings);
  assert.strictEqual(config.model, COST_MODELS.PAID_FIRST);
});

test('getCostModelConfig validates model and falls back to default', () => {
  const settings = { costModel: 'invalid-model' };
  const config = getCostModelConfig(settings);
  assert.strictEqual(config.model, DEFAULT_COST_MODEL);
});

test('getCostModelLabel returns human-readable labels', () => {
  assert.strictEqual(getCostModelLabel(COST_MODELS.ACTUAL_FIRST), 'Actual First (Default)');
  assert.strictEqual(getCostModelLabel(COST_MODELS.PAID_FIRST), 'Paid First');
  assert.strictEqual(getCostModelLabel(COST_MODELS.QUOTED_FIRST), 'Quoted First');
});

test('resolveCostPrecedenceWithModel handles partially_paid', () => {
  const entity = {
    actualCost: 0,
    paidCost: 0,
    partially_paid: 50,
    quotedCost: 90,
    estimatedCost: 70
  };
  const result = resolveCostPrecedenceWithModel(entity, COST_MODELS.ACTUAL_FIRST);
  assert.strictEqual(result.value, 50);
  assert.strictEqual(result.source, 'partially_paid');
});

test('resolveCostPrecedenceWithModel handles legacy field names', () => {
  const entity = {
    actual_cost: 100,
    amount_paid: 80,
    quoted_cost: 90,
    estimated_cost: 70
  };
  const result = resolveCostPrecedenceWithModel(entity);
  assert.strictEqual(result.value, 100);
  assert.strictEqual(result.source, 'actual');
});
