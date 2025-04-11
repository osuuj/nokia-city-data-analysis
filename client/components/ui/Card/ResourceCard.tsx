import { Button, Card, CardBody, Link } from '@heroui/react';
import { Icon } from '@iconify/react';

interface Resource {
  title: string;
  description: string;
  icon: string;
  type: string;
  link: string;
}
export function ResourceCard({ title, description, icon, type, link }: Resource) {
  return (
    <Card className="backdrop-blur-md bg-opacity-90">
      <CardBody>
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon icon={icon} className="text-xl" />
            </div>
          </div>
          <div className="flex-grow">
            <h3 className="font-semibold text-lg">{title}</h3>
            <p className="text-default-500 text-sm mt-1 mb-3">{description}</p>
            <div className="flex justify-between items-center">
              <span className="text-xs px-2 py-1 bg-default-100 rounded-full">{type}</span>
              <Button
                as={Link}
                href={link}
                color="primary"
                variant="light"
                size="sm"
                endContent={<Icon icon="lucide:arrow-right" />}
              >
                {type === 'PDF' || type === 'Template' ? 'Download' : 'View'}
              </Button>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
