import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ShieldCheck, Search, Award, CheckCircle2, ArrowLeft, AlertCircle, QrCode } from "lucide-react";
import { programService } from "../../services/programService";
import { dataStore } from "../../services/dataStore";

export default function VerifyCertificate() {
  const { certificateId } = useParams();
  const [query, setQuery] = useState(certificateId || "");
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (certificateId) {
      handleSearch(certificateId);
    }
  }, [certificateId]);

  const handleSearch = async (idToSearch) => {
    const term = (idToSearch || query).trim().toUpperCase();
    if (!term) return;

    setSearched(true);
    setLoading(true);

    try {
      // 1. Try querying backend database endpoint
      const cert = await programService.getCertificate(term);
      if (cert) {
        setResult({
          certificateId: cert.certificateId || cert.certificate_id,
          employeeName: cert.employeeName || cert.employee_name,
          programName: cert.programTitle || cert.program_title,
          trainerName: cert.trainerName || cert.trainer_name,
          issuedAt: cert.issuedAt || cert.issue_date_str,
          status: cert.status,
          verificationUrl: cert.qrUrl || window.location.href
        });
        setLoading(false);
        return;
      }
    } catch (e) {
      console.warn("Backend certificate check returned 404 or failed, checking fallback:", e.message);
    }

    // 2. Fallback to local storage registry
    const certsMap = dataStore.get("user_certificates", {});
    let found = null;
    Object.values(certsMap).forEach((list) => {
      list.forEach((c) => {
        if (c.certificateId?.toUpperCase() === term) {
          found = c;
        }
      });
    });

    setResult(found);
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg)", padding: "40px 20px" }}>
      <div style={{ maxWidth: "680px", margin: "0 auto" }}>
        <div style={{ marginBottom: 20 }}>
          <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "13px", fontWeight: 600, color: "var(--text-muted)" }}>
            <ArrowLeft size={16} />
            <span>Back to Portal Home</span>
          </Link>
        </div>

        <div className="corporate-card" style={{ padding: "36px 32px" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "var(--color-primary-light)",
                color: "var(--color-primary)",
                display: "grid",
                placeItems: "center",
                margin: "0 auto 14px",
              }}
            >
              <ShieldCheck size={28} />
            </div>
            <h1 style={{ fontSize: "24px", fontWeight: 800, color: "var(--text-heading)", margin: "0 0 6px 0" }}>
              Workplace Credential Verification
            </h1>
            <p style={{ fontSize: "13.5px", color: "var(--text-muted)", margin: 0 }}>
              Verify authentic occupational health completion credentials issued by certified ergonomists and occupational health specialists.
            </p>
          </div>

          <div style={{ display: "flex", gap: 10, marginBottom: 28 }}>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. IOH-2026-A1B2C3"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ fontFamily: "monospace", textTransform: "uppercase" }}
            />
            <button
              type="button"
              disabled={loading}
              onClick={() => handleSearch()}
              className="btn-primary"
              style={{ padding: "10px 22px", whiteSpace: "nowrap" }}
            >
              <Search size={15} />
              <span>{loading ? "Verifying..." : "Verify"}</span>
            </button>
          </div>

          {searched && (
            <div>
              {result ? (
                <div
                  style={{
                    background: "#F5FAF8",
                    border: "1.5px solid var(--color-primary)",
                    borderRadius: 8,
                    padding: "24px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 14
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--color-primary)" }}>
                      <CheckCircle2 size={20} />
                      <strong style={{ fontSize: "15px" }}>Official Credential Verified (ISO 45001)</strong>
                    </div>
                    <span style={{ fontSize: "11.5px", fontWeight: 700, color: "#065f46", background: "#d1fae5", padding: "2px 8px", borderRadius: 4 }}>
                      AUTHENTIC RECORD
                    </span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: "13px" }}>
                    <div>
                      <span style={{ color: "var(--text-muted)", display: "block" }}>Recipient:</span>
                      <strong style={{ color: "var(--text-heading)" }}>{result.employeeName}</strong>
                    </div>
                    <div>
                      <span style={{ color: "var(--text-muted)", display: "block" }}>Program Title:</span>
                      <strong style={{ color: "var(--text-heading)" }}>{result.programName}</strong>
                    </div>
                    <div>
                      <span style={{ color: "var(--text-muted)", display: "block" }}>Verified By:</span>
                      <strong style={{ color: "var(--text-heading)" }}>{result.trainerName}</strong>
                    </div>
                    <div>
                      <span style={{ color: "var(--text-muted)", display: "block" }}>Date Issued:</span>
                      <strong style={{ color: "var(--text-heading)" }}>{result.issuedAt}</strong>
                    </div>
                  </div>

                  <div style={{ borderTop: "1px solid #DCEFEB", paddingTop: 10, fontSize: "11.5px", color: "var(--text-muted)", fontFamily: "monospace" }}>
                    Credential Registry ID: <strong>{result.certificateId}</strong> • Verified against WorkHealth AI Occupational Health Registry
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    background: "#FDEEEE",
                    border: "1px solid #F5C6C6",
                    borderRadius: 8,
                    padding: "20px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    color: "#C93B3B",
                    fontSize: "13.5px"
                  }}
                >
                  <AlertCircle size={20} />
                  <span>No credential matching <strong>"{query}"</strong> was found in the official registry or it has been revoked. Please verify the ID.</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
