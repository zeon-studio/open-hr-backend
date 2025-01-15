import { paginationHelpers } from "@/lib/paginationHelper";
import { PaginationType } from "@/types";
import { PipelineStage } from "mongoose";
import { Tool } from "./tool.model";
import { ToolFilterOptions, ToolType } from "./tool.type";

// get all data
const getAllToolService = async (
  paginationOptions: Partial<PaginationType>,
  filterOptions: Partial<ToolFilterOptions>
) => {
  let matchStage: any = {
    $match: {},
  };
  const { limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  // Extract search and filter options
  const { search, platform } = filterOptions;

  // Search condition
  if (search) {
    const searchKeyword = String(search).replace(/\+/g, " ");
    const keywords = searchKeyword.split("|");
    const searchConditions = keywords.map((keyword) => ({
      $or: [{ name: { $regex: keyword, $options: "i" } }],
    }));
    matchStage.$match.$or = searchConditions;
  }

  // platform condition
  if (platform) {
    matchStage.$match.platform = platform;
  }

  let pipeline: PipelineStage[] = [matchStage];

  pipeline.push({ $sort: { updatedAt: -1 } });

  if (skip) {
    pipeline.push({ $skip: skip });
  }
  if (limit) {
    pipeline.push({ $limit: limit });
  }

  pipeline.push(
    {
      $lookup: {
        from: "employees",
        localField: "organizations.users",
        foreignField: "id",
        as: "employee",
      },
    },
    {
      $project: {
        _id: 0,
        platform: 1,
        website: 1,
        organizations: 1,
        "employee.name": 1,
        "employee.image": 1,
      },
    }
  );

  const result = await Tool.aggregate(pipeline);
  const total = await Tool.countDocuments();
  return {
    result: result,
    meta: {
      total: total,
    },
  };
};

// get single data
const getToolService = async (id: string) => {
  const result = await Tool.findOne({ tool_id: id });
  return result;
};

// add or update
const updateToolService = async (id: string, updateData: ToolType) => {
  const tool = await Tool.findOne({ platform: id });

  if (tool) {
    // Update existing organizations or add new ones
    updateData.organizations.forEach((newOrg) => {
      const existingOrgIndex = tool.organizations.findIndex(
        (org) => org.name === newOrg.name
      );
      if (existingOrgIndex !== -1) {
        // Update existing organization
        tool.organizations[existingOrgIndex] = {
          ...tool.organizations[existingOrgIndex],
          ...newOrg,
        };
      } else {
        // Add new organization
        tool.organizations.push(newOrg);
      }
    });
    await tool.save();
    return tool;
  } else {
    // Create new tool if it doesn't exist
    const newTool = new Tool(updateData);
    await newTool.save();
    return newTool;
  }
};

// delete
const deleteToolService = async (id: string) => {
  await Tool.findOneAndDelete({ tool_id: id });
};

export const toolService = {
  getAllToolService,
  getToolService,
  updateToolService,
  deleteToolService,
};
