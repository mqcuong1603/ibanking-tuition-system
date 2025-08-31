import TransactionLock from "../models/TransactionLock.js";
import { LOCK_RESOURCE_TYPE } from "../config/constants.js";

export const acquireLock = async (resourceType, resourceId, amount = null) => {
  try {
    // Set lock expiry to 10 minutes
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    const lockId = await TransactionLock.acquire(
      resourceType,
      resourceId,
      amount,
      expiresAt
    );

    return lockId !== null;
  } catch (error) {
    console.error("Lock acquisition error:", error);
    return false;
  }
};

export const releaseLock = async (resourceType, resourceId) => {
  try {
    return await TransactionLock.release(resourceType, resourceId);
  } catch (error) {
    console.error("Lock release error:", error);
    return false;
  }
};

export const isLocked = async (resourceType, resourceId) => {
  try {
    const lock = await TransactionLock.findActive(resourceType, resourceId);
    return lock !== null;
  } catch (error) {
    console.error("Lock check error:", error);
    return false;
  }
};
