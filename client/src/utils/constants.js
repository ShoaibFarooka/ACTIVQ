export const ADMIN_ROUTES = [
  { label: "Company Information", link: "/company-information" },
  { label: "Users", link: "/users" },
  { label: "Clients", link: "/clients" },
  { label: "Equipments", link: "/equipments" },
  { label: "Issue Calibration Report", link: "/issue-calibration-report" },
  { label: "QMS", link: "/qms" },
];

export const MANAGER_ROUTES = [
  { label: "Users", link: "/users" },
  { label: "Clients", link: "/clients" },
  { label: "Equipments", link: "/equipments" },
  { label: "Issue Calibration Report", link: "/issue-calibration-report" },
  { label: "QMS", link: "/qms" },
];

export const EMPLOYEE_ROUTES = [
  { label: "Issue Calibration Report", link: "/issue-calibration-report" },
];

export const AUTHORITY = {
    level_one: 'Use of equipment',
    level_two: 'Execution of laboratory calibration',
    level_three: 'Supply',
    level_four: 'Development, editing or validation of methods',
    level_five: 'Photo signature',
}

export const NUMBER_REGEX = /^-?[0-9]*\.?[0-9]*$/;
