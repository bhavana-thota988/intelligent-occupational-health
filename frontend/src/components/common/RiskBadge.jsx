import React from "react";
import { getRiskTier } from "../../services/employeeService";

export default function RiskBadge({ score, tierLabel = null, size = "md" }) {
  const tier = tierLabel
    ? {
        label: tierLabel,
        className:
          tierLabel.toLowerCase() === "high"
            ? "badge-high"
            : tierLabel.toLowerCase() === "moderate" || tierLabel.toLowerCase() === "mod"
            ? "badge-mod"
            : "badge-low",
      }
    : getRiskTier(score);

  return (
    <span
      className={`badge ${tier.className}`}
      style={{
        fontSize: size === "sm" ? "11px" : size === "lg" ? "13px" : "12px",
        padding: size === "sm" ? "2px 8px" : size === "lg" ? "6px 14px" : "4px 10px",
      }}
    >
      {tier.label} Risk {score !== undefined && score !== null ? `(${score}%)` : ""}
    </span>
  );
}
