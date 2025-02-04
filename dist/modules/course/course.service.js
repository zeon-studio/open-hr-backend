"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseService = void 0;
const paginationHelper_1 = require("../../lib/paginationHelper");
const course_model_1 = require("./course.model");
// get all data
const getAllCourseService = (paginationOptions, filterOptions) => __awaiter(void 0, void 0, void 0, function* () {
    let matchStage = {
        $match: {},
    };
    const { limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    // Extract search and filter options
    const { search, platform } = filterOptions;
    // Search condition
    if (search) {
        const searchKeyword = String(search).replace(/\+/g, " ");
        const keywords = searchKeyword.split("|");
        const searchConditions = keywords.map((keyword) => ({
            $or: [
                { platform: { $regex: keyword, $options: "i" } },
                { website: { $regex: keyword, $options: "i" } },
            ],
        }));
        matchStage.$match.$or = searchConditions;
    }
    // platform condition
    if (platform) {
        matchStage.$match.platform = platform;
    }
    let pipeline = [matchStage];
    // Sorting stage
    pipeline.push({
        $sort: {
            [sortBy]: sortOrder === "asc" ? 1 : -1,
            _id: 1,
        },
    });
    if (skip) {
        pipeline.push({ $skip: skip });
    }
    if (limit) {
        pipeline.push({ $limit: limit });
    }
    pipeline.push({
        $project: {
            _id: 1,
            platform: 1,
            website: 1,
            email: 1,
            password: 1,
            courses: 1,
        },
    });
    const result = yield course_model_1.Course.aggregate(pipeline);
    const total = yield course_model_1.Course.countDocuments();
    return {
        result: result,
        meta: {
            total: total,
        },
    };
});
// get single data
const getCourseService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield course_model_1.Course.findOne({ platform: id });
    return result;
});
// create
const createCourseService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield course_model_1.Course.create(data);
    return result;
});
// update
const updateCourseService = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const course = yield course_model_1.Course.findOne({ _id: id });
    if (course) {
        // Update existing course
        const updatedCourse = yield course_model_1.Course.findOneAndUpdate({ _id: id }, updateData, { new: true });
        return updatedCourse;
    }
    else {
        // Create new course
        const newCourse = new course_model_1.Course(updateData);
        yield newCourse.save();
        return newCourse;
    }
});
// delete
const deleteCourseService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield course_model_1.Course.findOneAndDelete({ _id: id });
});
// get course by user
const getCoursesByUserService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const courses = yield course_model_1.Course.find({
        $or: [
            { "courses.users": { $in: [id] } },
            { "courses.users": { $in: ["everyone"] } },
        ],
    });
    const result = courses.flatMap((course) => course.courses
        .filter((c) => c.users.includes(id))
        .map((c) => ({
        _id: c._id,
        name: c.name,
        price: c.price,
        purchase_date: c.purchase_date,
        expire_date: c.expire_date,
        platform: course.platform,
        website: course.website,
        email: course.email,
        password: course.password,
    })));
    return result;
});
exports.courseService = {
    getAllCourseService,
    getCourseService,
    createCourseService,
    updateCourseService,
    deleteCourseService,
    getCoursesByUserService,
};
//# sourceMappingURL=course.service.js.map