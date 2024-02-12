const allRoles = {
  user: ['updateSelf', 'deleteSelf', 'readOwn', 'manageApplicant'],
  hirer: ['updateSelf', 'deleteSelf', 'readOwn'],
  admin: ['updateSelf', 'deleteSelf', 'readOwn', 'updateAny', 'deleteAny', 'readAny']
};

export const roles: string[] = Object.keys(allRoles);
export const roleRights: Map<string, string[]> = new Map(Object.entries(allRoles));
