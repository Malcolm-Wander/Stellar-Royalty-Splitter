import { retryBuildTx } from "../stellar.js";
import { recordTransaction, addAuditLog } from "../database/index.js";

/**
 * Shared pattern for transaction-building routes:
 * 1. Record transaction in database
 * 2. Build transaction XDR (with correlation ID threaded through RPC calls)
 * 3. Log audit event
 * 4. Return XDR and transaction ID
 *
 * #396: Accepts an optional `correlationId` so every Stellar RPC call made
 * during this request shares the same trace context in logs and metrics.
 */
export async function buildAndRecordTransaction({
  contractId,
  walletAddress,
  transactionType,
  scvlArgs,
  auditAction,
  auditMetadata,
  transactionMetadata = {},
  correlationId,
}) {
  // Record transaction in database for audit trail
  const transactionId = recordTransaction(
    contractId,
    transactionType,
    walletAddress,
    transactionMetadata
  );

  // Build the transaction XDR — pass correlationId for RPC tracing
  const txXdr = await retryBuildTx(
    walletAddress,
    contractId,
    transactionType,
    scvlArgs,
    correlationId,
  );

  // Log the audit event
  addAuditLog(contractId, auditAction, walletAddress, {
    transactionId,
    ...auditMetadata,
  });

  return { xdr: txXdr, transactionId };
}
