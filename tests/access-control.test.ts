import { describe, it, beforeEach, expect } from "vitest"

describe("Access Control Contract", () => {
  let mockStorage: Map<string, any>
  let mockBCIData: Map<string, any>
  
  beforeEach(() => {
    mockStorage = new Map()
    mockBCIData = new Map()
    mockBCIData.set("data-1", { owner: "user1", data_hash: "0x1234", timestamp: 123, data_type: "eeg" })
  })
  
  const mockContractCall = (method: string, args: any[], sender: string) => {
    switch (method) {
      case "grant-access":
        const [grantDataId, grantUser] = args
        if (mockBCIData.get(`data-${grantDataId}`).owner !== sender) return { success: false, error: 403 }
        mockStorage.set(`permission-${grantDataId}-${grantUser}`, { can_access: true })
        return { success: true }
      
      case "revoke-access":
        const [revokeDataId, revokeUser] = args
        if (mockBCIData.get(`data-${revokeDataId}`).owner !== sender) return { success: false, error: 403 }
        mockStorage.delete(`permission-${revokeDataId}-${revokeUser}`)
        return { success: true }
      
      case "check-access":
        const [checkDataId, checkUser] = args
        const data = mockBCIData.get(`data-${checkDataId}`)
        if (!data) return { success: false, error: 404 }
        const hasAccess = data.owner === checkUser || mockStorage.has(`permission-${checkDataId}-${checkUser}`)
        return { success: true, value: hasAccess }
      
      default:
        return { success: false, error: "Unknown method" }
    }
  }
  
  it("should grant access", () => {
    const result = mockContractCall("grant-access", [1, "user2"], "user1")
    expect(result.success).toBe(true)
  })
  
  it("should not grant access if not the owner", () => {
    const result = mockContractCall("grant-access", [1, "user3"], "user2")
    expect(result.success).toBe(false)
    expect(result.error).toBe(403)
  })
  
  it("should revoke access", () => {
    mockContractCall("grant-access", [1, "user2"], "user1")
    const result = mockContractCall("revoke-access", [1, "user2"], "user1")
    expect(result.success).toBe(true)
  })
  
  it("should check access", () => {
    mockContractCall("grant-access", [1, "user2"], "user1")
    const result = mockContractCall("check-access", [1, "user2"], "anyone")
    expect(result.success).toBe(true)
    expect(result.value).toBe(true)
  })
})

