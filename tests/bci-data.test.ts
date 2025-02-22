import { describe, it, beforeEach, expect } from "vitest"

describe("BCI Data Contract", () => {
  let mockStorage: Map<string, any>
  let nextDataId: number
  
  beforeEach(() => {
    mockStorage = new Map()
    nextDataId = 0
  })
  
  const mockContractCall = (method: string, args: any[], sender: string) => {
    switch (method) {
      case "submit-bci-data":
        const [dataHash, dataType] = args
        nextDataId++
        mockStorage.set(`data-${nextDataId}`, {
          owner: sender,
          data_hash: dataHash,
          timestamp: 123, // Mock block height
          data_type: dataType,
        })
        return { success: true, value: nextDataId }
      
      case "get-bci-data":
        return { success: true, value: mockStorage.get(`data-${args[0]}`) }
      
      case "get-next-data-id":
        return { success: true, value: nextDataId }
      
      default:
        return { success: false, error: "Unknown method" }
    }
  }
  
  it("should submit BCI data", () => {
    const result = mockContractCall("submit-bci-data", ["0x1234567890abcdef", "eeg"], "user1")
    expect(result.success).toBe(true)
    expect(result.value).toBe(1)
  })
  
  it("should get BCI data", () => {
    mockContractCall("submit-bci-data", ["0x1234567890abcdef", "eeg"], "user1")
    const result = mockContractCall("get-bci-data", [1], "anyone")
    expect(result.success).toBe(true)
    expect(result.value).toEqual({
      owner: "user1",
      data_hash: "0x1234567890abcdef",
      timestamp: 123,
      data_type: "eeg",
    })
  })
  
  it("should get next data id", () => {
    mockContractCall("submit-bci-data", ["0x1234567890abcdef", "eeg"], "user1")
    const result = mockContractCall("get-next-data-id", [], "anyone")
    expect(result.success).toBe(true)
    expect(result.value).toBe(1)
  })
})

