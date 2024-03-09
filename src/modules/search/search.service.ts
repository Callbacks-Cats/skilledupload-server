import { Applicant } from '../applicant';

// /**
//  * Search Service by name, userId, jobCategory. Search should only user role. User modal has reference to applicant modal. On the applicant model we have reference to jobCategory.
//  * @param {ISearchPayload} payload - Search payload containing userId, jobCategory, and name
//  * @returns {Promise<any>} - Promise resolving to search results
//  */
// export const search = async (payload: any): Promise<any> => {
//   const { userId, jobCategory, name } = payload;

//   try {
//     // Construct base query to search applicants
//     const applicantQuery: any = {}; // Define an empty object for the query

//     // If userId is provided, add it to the query
//     if (userId) {
//       applicantQuery['user'] = userId;
//     }

//     // If name is provided, construct a regex query for intro or other relevant fields
//     if (name) {
//       const nameRegex = new RegExp(name, 'i'); // Case-insensitive regex for name
//       applicantQuery['$or'] = [{ intro: nameRegex }, { resume: nameRegex }];
//     }

//     // If jobCategory is provided, add it to the query
//     if (jobCategory) {
//       applicantQuery['skills.jobCategory'] = jobCategory; // Match the jobCategory in Applicant's skills array
//     }

//     // Search applicants based on constructed query
//     const applicants = await Applicant.find(applicantQuery);
//     return applicants;
//   } catch (error) {
//     // Handle errors
//     console.error('Error during search:', error);
//     throw error;
//   }
// };

export const search = async (payload: any): Promise<any> => {
  const { keyword, jobCategory, userId, page, limit } = payload;

  const getAllApplicants = await Applicant.find({}).populate('user skills.jobCategory');
  let searchResults: any;

  if (keyword === '' && jobCategory === '' && userId === '') {
    searchResults = getAllApplicants;
  }

  if (keyword === undefined && jobCategory === undefined && userId === undefined) {
    searchResults = getAllApplicants;
  }

  // if userId is provided
  if (userId) {
    searchResults = getAllApplicants.filter((applicant: any) => {
      if (!applicant.user) return false;
      return applicant.user.id === userId;
    });
    // return searchResults;
  }

  // if name and jobCategory is provided
  if (keyword && jobCategory) {
    searchResults = getAllApplicants.filter((applicant: any) => {
      if (!applicant.skills) return false;
      if (!applicant.user) return false;

      const firstName = applicant.user.firstName.toLowerCase();
      const lastName = applicant.user.lastName.toLowerCase();
      const searchName = keyword.toLowerCase();

      const filteredSkills = applicant.skills.filter((skill: any) => {
        return skill?.jobCategory?.toString().toLowerCase() === jobCategory.toLowerCase();
      });

      if (filteredSkills.length === 0) return false;

      return firstName.includes(searchName) || lastName.includes(searchName);
    });
    // return searchResults;
  }

  // if name is provided
  if (keyword) {
    searchResults = getAllApplicants.filter((applicant: any) => {
      if (!applicant.user) return false;

      if (!applicant.skills) return false;
      return applicant.skills.some((skill: any) => {
        if (!skill) return false;

        const jobCategoryName = skill?.jobCategory?.name;

        if (!jobCategoryName) return false;
        return jobCategoryName.toLowerCase().includes(keyword.toLowerCase());
      });
    });
    // return searchResults;
  }

  // If jobCategory is provided
  if (jobCategory) {
    searchResults = getAllApplicants.filter((applicant: any) => {
      if (applicant.skills.length === 0) return false;
      return applicant.skills.some((skill: any) => {
        if (skill?.jobCategory?._id.toString() === jobCategory) {
          return true;
        } else {
          return false;
        }
      });
    });
  }

  const formattedResults = searchResults.map((result: any) => {
    const documentData = result._doc;

    const formattedResult = {
      education: documentData.education,
      user: documentData.user,
      status: documentData.status,
      skills: documentData.skills.map((skill: any) => ({
        name: skill.jobCategory.name,
        description: skill.jobCategory.description,
        image: skill.jobCategory.image,
        createdAt: skill.jobCategory.createdAt,
        updatedAt: skill.jobCategory.updatedAt,
        id: skill.jobCategory.id,
        yearsOfExperience: skill.yearsOfExperience
      })),
      videoResume: documentData.videoResume,
      createdAt: documentData.createdAt,
      updatedAt: documentData.updatedAt,
      slug: documentData.slug,
      intro: documentData.intro,
      id: documentData._id
    };

    return formattedResult;
  });

  const pageLimit = limit || 10;
  const pageNumber = page || 1;
  const totalResults = formattedResults.length;
  const totalPages = Math.ceil(totalResults / pageLimit);
  const currentShowing = totalResults - (pageNumber - 1) * pageLimit;

  const paginatedResults = formattedResults.slice(
    (pageNumber - 1) * pageLimit,
    pageNumber * pageLimit
  );

  return {
    results: paginatedResults,
    limit: pageLimit,
    page: pageNumber,
    totalResults,
    totalPages,
    currentItemsCount: currentShowing
  };
};
