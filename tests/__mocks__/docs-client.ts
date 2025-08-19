// Mock for SFCCDocumentationClient
export const SFCCDocumentationClient = jest.fn().mockImplementation(() => ({
  getClassDetailsExpanded: jest.fn(),
  getAvailableClasses: jest.fn(),
  searchClasses: jest.fn(),
  searchMethods: jest.fn(),
  getClassDocumentation: jest.fn(),
}));
