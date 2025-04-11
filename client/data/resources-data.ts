interface Resource {
  title: string;
  description: string;
  icon: string;
  type: string;
  link: string;
}

interface ResourceData {
  cityResources: Resource[];
  toolkits: Resource[];
  educational: Resource[];
  downloadables: Resource[];
}

const resourcesData: ResourceData = {
  cityResources: [
    {
      title: 'Business License Guide',
      description: 'Step-by-step guide to obtaining and renewing business licenses in our city.',
      icon: 'lucide:file-text',
      type: 'Guide',
      link: '/resources/business-license-guide',
    },
    {
      title: 'Zoning Regulations',
      description: 'Comprehensive overview of city zoning laws and regulations for businesses.',
      icon: 'lucide:map',
      type: 'Document',
      link: '/resources/zoning-regulations',
    },
    {
      title: 'Permit Application Process',
      description: 'Detailed information about required permits and the application process.',
      icon: 'lucide:clipboard-check',
      type: 'Guide',
      link: '/resources/permits',
    },
    {
      title: 'City Services Directory',
      description: 'Directory of all city services available to businesses and residents.',
      icon: 'lucide:phone',
      type: 'Directory',
      link: '/resources/city-services',
    },
  ],
  toolkits: [
    {
      title: 'Business Startup Kit',
      description: 'Essential resources and templates for starting a new business.',
      icon: 'lucide:briefcase',
      type: 'Kit',
      link: '/resources/startup-kit',
    },
    {
      title: 'Marketing Templates',
      description: 'Professional templates for business marketing materials.',
      icon: 'lucide:megaphone',
      type: 'Templates',
      link: '/resources/marketing-templates',
    },
    {
      title: 'Financial Planning Tools',
      description: 'Spreadsheets and calculators for business financial planning.',
      icon: 'lucide:calculator',
      type: 'Tools',
      link: '/resources/financial-tools',
    },
    {
      title: 'HR Documentation Pack',
      description: 'Essential HR documents and templates for small businesses.',
      icon: 'lucide:users',
      type: 'Kit',
      link: '/resources/hr-docs',
    },
  ],
  educational: [
    {
      title: 'Business Best Practices',
      description: 'Video series covering essential business management practices.',
      icon: 'lucide:play-circle',
      type: 'Video',
      link: '/resources/best-practices',
    },
    {
      title: 'Market Research Guide',
      description: 'Learn how to conduct effective market research for your business.',
      icon: 'lucide:search',
      type: 'Guide',
      link: '/resources/market-research',
    },
    {
      title: 'Financial Literacy Course',
      description: 'Online course covering business finance fundamentals.',
      icon: 'lucide:book',
      type: 'Course',
      link: '/resources/finance-course',
    },
    {
      title: 'Digital Marketing Workshop',
      description: 'Step-by-step guide to digital marketing strategies.',
      icon: 'lucide:trending-up',
      type: 'Workshop',
      link: '/resources/digital-marketing',
    },
  ],
  downloadables: [
    {
      title: 'Business Plan Template',
      description: 'Professional template for creating a comprehensive business plan.',
      icon: 'lucide:file-text',
      type: 'Template',
      link: '/resources/business-plan-template.pdf',
    },
    {
      title: 'Budget Calculator',
      description: 'Excel spreadsheet for tracking business expenses and revenue.',
      icon: 'lucide:spreadsheet',
      type: 'Tool',
      link: '/resources/budget-calculator.xlsx',
    },
    {
      title: 'Marketing Calendar',
      description: 'Printable calendar for planning marketing activities.',
      icon: 'lucide:calendar',
      type: 'PDF',
      link: '/resources/marketing-calendar.pdf',
    },
    {
      title: 'Employee Handbook Template',
      description: 'Customizable template for creating an employee handbook.',
      icon: 'lucide:book-open',
      type: 'Template',
      link: '/resources/employee-handbook.docx',
    },
  ],
};

export default resourcesData;
