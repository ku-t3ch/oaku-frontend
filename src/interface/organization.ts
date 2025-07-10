export interface Organization {
  id: string;
  publicOrganizationId: string;
    nameEn: string;
    nameTh: string;
    image: string;
    campus: {
        id: string;
        name: string;
    };
    organizationType: {
        id: string;
        name: string;
    };
    createdAt: string;
    updatedAt: string;
};
