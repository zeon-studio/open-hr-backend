export type Document = {
  name: string;
  file: string;
  date: Date;
};

export type EmployeeDocumentType = {
  employee_id: string;
  documents: Document[];
};

export type EmployeeDocumentFilterOptions = {
  search?: string;
};
