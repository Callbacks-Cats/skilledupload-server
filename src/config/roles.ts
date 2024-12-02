const allRoles = {
  user: ['updateOwn', 'deleteOwn', 'readOwn', 'uploadResume'],
  hirer: ['updateOwn', 'deleteOwn', 'readOwn'],
  admin: [
    'updateOwn',
    'deleteOwn',
    'readOwn',
    'updateAny',
    'deleteAny',
    'readAny',
    'manageApplicant',
    'manageJobCategories',
    'manageJobPosts',
    'manageBanner',
    'createUserApplicant',
    'deleteApplicant'
  ]
};

export const roles: string[] = Object.keys(allRoles);
export const roleRights: Map<string, string[]> = new Map(Object.entries(allRoles));
