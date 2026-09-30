import { create } from 'zustand'

const useDocumentStore = create((set) => ({
  // Current uploaded document
  documentId:   null,
  documentName: null,
  wordCount:    null,
  pageCount:    null,

  // Active tab/feature
  activeTab: 'qa',

  // Actions
  setDocument: (doc) => set({
    documentId:   doc.document_id,
    documentName: doc.original_name,
    wordCount:    doc.word_count,
    pageCount:    doc.page_count,
  }),

  clearDocument: () => set({
    documentId:   null,
    documentName: null,
    wordCount:    null,
    pageCount:    null,
  }),

  setActiveTab: (tab) => set({ activeTab: tab }),
}))

export default useDocumentStore