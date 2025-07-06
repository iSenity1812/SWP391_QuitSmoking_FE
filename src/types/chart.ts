/**
 * ====================================================================
 * CHART TYPES - Type definitions cho các chart components
 * ====================================================================
 */

// Recharts tooltip payload type
export interface TooltipPayload {
  color: string;
  dataKey: string;
  name: string;
  value: number;
  payload: Record<string, unknown>;
}

// Recharts pie chart label props
export interface PieChartLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
}

// Market share tooltip data
export interface MarketShareTooltipData {
  name: string;
  value: number;
  revenue: number;
  subscriptions: number;
}
