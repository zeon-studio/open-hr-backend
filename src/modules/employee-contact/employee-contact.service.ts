import { paginationHelpers } from "@/lib/paginationHelper";
import { PaginationType } from "@/types";
import { PipelineStage } from "mongoose";
import { EmployeeContact } from "./employee-contact.model";
import {
  EmployeeContactFilterOptions,
  EmployeeContactType,
} from "./employee-contact.type";

// get all data
const getAllEmployeeContactService = async (
  paginationOptions: Partial<PaginationType>,
  filterOptions: Partial<EmployeeContactFilterOptions>
) => {
  let matchStage: any = {
    $match: {},
  };
  const { limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  // Extract search and filter options
  const { search } = filterOptions;

  // Search condition
  if (search) {
    const searchKeyword = String(search).replace(/\+/g, " ");
    const keywords = searchKeyword.split("|");
    const searchConditions = keywords.map((keyword) => ({
      $or: [{ employee_id: { $regex: keyword, $options: "i" } }],
    }));
    matchStage.$match.$or = searchConditions;
  }

  let pipeline: PipelineStage[] = [matchStage];

  pipeline.push({ $sort: { updatedAt: -1 } });

  if (skip) {
    pipeline.push({ $skip: skip });
  }
  if (limit) {
    pipeline.push({ $limit: limit });
  }

  pipeline.push({
    $project: {
      _id: 0,
      employee_id: 1,
      contacts: 1,
    },
  });

  const result = await EmployeeContact.aggregate(pipeline);
  const total = await EmployeeContact.countDocuments();
  return {
    result: result,
    meta: {
      total: total,
    },
  };
};

// get single data
const getEmployeeContactService = async (id: string) => {
  const result = await EmployeeContact.findOne({ employee_id: id });
  return result;
};

// add or update
const updateEmployeeContactService = async (
  id: string,
  updateData: EmployeeContactType
) => {
  const contact = await EmployeeContact.findOne({ platform: id });

  if (contact) {
    // Update existing contacts or add new ones
    updateData.contacts.forEach((newContact) => {
      const existingContactIndex = contact.contacts.findIndex(
        (contact) => contact.name === newContact.name
      );
      if (existingContactIndex !== -1) {
        // Update existing contact
        contact.contacts[existingContactIndex] = {
          ...contact.contacts[existingContactIndex],
          ...newContact,
        };
      } else {
        // Add new contact
        contact.contacts.push(newContact);
      }
    });
    await contact.save();
    return contact;
  } else {
    // Create new contact if it doesn't exist
    const newEmployeeContact = new EmployeeContact(updateData);
    await newEmployeeContact.save();
    return newEmployeeContact;
  }
};

// delete
const deleteEmployeeContactService = async (id: string) => {
  await EmployeeContact.findOneAndDelete({ employee_id: id });
};

export const employeeContactService = {
  getAllEmployeeContactService,
  getEmployeeContactService,
  deleteEmployeeContactService,
  updateEmployeeContactService,
};
